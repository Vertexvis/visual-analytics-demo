import React, { useCallback, useEffect, useState } from 'react';
import { ColorMaterial, Environment } from '@vertexvis/viewer';
import { useDropzone } from 'react-dropzone';
import { onTap, Viewer } from '../components/Viewer';
import { Sidebar } from '../components/Sidebar';
import {
  createBIData,
  DefaultBIData,
  BIData,
} from '../lib/business-intelligence';
import { handleCsvUpload } from '../lib/file-upload';
import { useViewer } from '../lib/viewer';
import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { applyBIData } from '../lib/scene-alterations';

const MonoscopicViewer = onTap(Viewer);

const selectColor = {
  ...ColorMaterial.create(255, 255, 0),
  glossiness: 4,
  specular: {
    r: 255,
    g: 255,
    b: 255,
    a: 0,
  },
};

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
        applyBIData(biData, s).then(() => setBIData(biData));
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
    const ids = [...biData.items.entries()]
      .filter(([, v]) => v.value === value)
      .map(([k]) => k);

    setBIData({ ...biData, table });
    await scene
      .items((op) => {
        const w = op.where((q) => q.withSuppliedIds(ids));
        return [
          checked
            ? w.materialOverride(ColorMaterial.fromHex(val.color))
            : w.clearMaterialOverrides(),
        ];
      })
      .execute();
  }

  async function onReset(): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) {
      return;
    }

    setBIData(DefaultBIData);
    await scene
      .items((op) => [op.where((q) => q.all()).clearMaterialOverrides()])
      .execute();
  }

  async function handleModelSelect(
    hit?: vertexvis.protobuf.stream.IHit
  ): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) {
      return;
    }

    if (hit?.itemSuppliedId?.value != null) {
      const itemId = hit.itemSuppliedId.value;
      console.debug('Selected', itemId, biData.items.get(itemId));

      await scene
        .items((op) => {
          const ops = [
            ...(selected
              ? [op.where((q) => q.withSuppliedId(selected)).deselect()]
              : []),
            op.where((q) => q.withSuppliedId(itemId)).select(selectColor),
          ];
          setSelected(itemId);
          return ops;
        })
        .execute();
    } else if (selected) {
      await scene
        .items((op) => op.where((q) => q.withSuppliedId(selected)).deselect())
        .execute();
      setSelected('');
    }
  }

  return (
    <main className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
        <div className="flex w-full row-span-full col-span-full">
          {viewerCtx.viewerState.isReady && (
            <div className="w-0 flex-grow ml-auto relative" {...getRootProps()}>
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
  );
}
