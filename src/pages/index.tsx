import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { Environment } from '@vertexvis/viewer';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sidebar } from '../components/Sidebar';
import { onTap, Viewer } from '../components/Viewer';
import {
  applyBIData,
  applyOrClearBySuppliedId,
  clearAll,
  selectBySuppliedId,
} from '../lib/alterations';
import {
  createBIData,
  DefaultBIData,
  BIData,
} from '../lib/business-intelligence';
import { handleCsvUpload } from '../lib/file-upload';
import { useViewer } from '../lib/viewer';

const MonoscopicViewer = onTap(Viewer);

export default function Home(): JSX.Element {
  const viewerCtx = useViewer();
  const [biData, setBIData] = useState<BIData>(DefaultBIData);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    document.title = 'Vertex Business Intelligence';
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (viewerCtx.viewer.current == null) {
      return;
    }

    const fileName = acceptedFiles[0];
    viewerCtx.viewer.current.scene().then((s) => {
      if (s == null) {
        return;
      }

      handleCsvUpload(fileName).then((data) => {
        const biData = createBIData(data);
        applyBIData(s, biData).then(() => setBIData(biData));
      });
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  async function onCheck(value: string, checked: boolean): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    const table = biData.table;
    if (scene == null || table == null) {
      return;
    }

    const val = table.get(value);
    if (val == null) {
      return;
    }

    val.display = checked;
    table.set(value, val);

    setBIData({ ...biData, table });
    await applyOrClearBySuppliedId(
      scene,
      [...biData.items.entries()]
        .filter(([, v]) => v.value === value)
        .map(([k]) => k),
      val.color,
      checked
    );
  }

  async function onReset(): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) {
      return;
    }

    setBIData(DefaultBIData);
    await clearAll(scene);
  }

  async function handleModelSelect(
    hit?: vertexvis.protobuf.stream.IHit
  ): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) {
      return;
    }

    setSelected(
      await selectBySuppliedId(
        scene,
        hit?.itemSuppliedId?.value ?? '',
        selected
      )
    );
  }

  return (
    <>
      <Head>
        <title>Vertex Business Intelligence Demo</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon-512x512.png" />
      </Head>
      <main className="h-screen w-screen">
        <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
          <div className="flex w-full row-span-full col-span-full">
            {viewerCtx.viewerState.isReady && (
              <div
                className="w-0 flex-grow ml-auto relative"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <MonoscopicViewer
                  configEnv={
                    (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) ??
                    'platprod'
                  }
                  clientId={process.env.NEXT_PUBLIC_VERTEX_CLIENT_ID ?? ''}
                  streamKey={process.env.NEXT_PUBLIC_VERTEX_STREAM_KEY ?? ''}
                  viewer={viewerCtx.viewer}
                  onSceneReady={viewerCtx.onSceneReady}
                  onSelect={handleModelSelect}
                />
              </div>
            )}
            <Sidebar
              biData={biData}
              onCheck={onCheck}
              onReset={onReset}
              selection={biData.items.get(selected)}
            />
          </div>
        </div>
      </main>
    </>
  );
}
