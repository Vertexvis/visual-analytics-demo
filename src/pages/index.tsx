import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { LoadStreamKeyDialog } from '../components/LoadStreamKeyDialog';
import { useDropzone } from 'react-dropzone';
import { Sidebar } from '../components/Sidebar';
import { onTap, Viewer } from '../components/Viewer';
import {
  applyBIData,
  applyOrClearBySuppliedId,
  clearAll,
  selectBySuppliedId,
} from '../lib/alterations';
import { Env } from '../lib/env';
import {
  createBIData,
  DefaultBIData,
  BIData,
} from '../lib/business-intelligence';
import { handleCsvUpload } from '../lib/file-upload';
import { waitForHydrate } from '../lib/nextjs';
import {
  ClientId,
  getClientId,
  getStreamKey,
  setItem,
  StreamKey,
} from '../lib/storage';
import { useViewer } from '../lib/viewer';
import { VertexLogo } from '../components/VertexLogo';

const MonoscopicViewer = onTap(Viewer);
const Layout = dynamic<LayoutProps>(
  () => import('../components/Layout').then((m) => m.Layout),
  { ssr: false }
);

function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const [storedId, storedKey] = [getClientId(), getStreamKey()];

  const [biData, setBIData] = useState<BIData>(DefaultBIData);
  const [clientId, setClientId] = useState(
    queryId?.toString() ||
      storedId ||
      '08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA'
  );
  const [selected, setSelected] = useState<string>('');
  const [streamKey, setStreamKey] = useState(
    queryKey?.toString() || storedKey || 'U9cSWVb7fvS9k-NQcT28uZG6wtm6xmiG0ctU'
  );
  const [dialogOpen, setDialogOpen] = useState(!clientId || !streamKey);
  const viewerCtx = useViewer();

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        clientId
      )}&streamKey=${encodeURIComponent(streamKey)}`
    );
    setItem(ClientId, clientId);
    setItem(StreamKey, streamKey);
  }, [clientId, streamKey]);

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

  return (
    <Layout title="Vertex Business Intelligence">
      <div className="col-span-full">
        <Header logo={<VertexLogo />}>
          <div className="ml-4 mr-auto">
            <button
              className="btn btn-primary text-sm"
              onClick={() => setDialogOpen(true)}
            >
              Open Scene
            </button>
          </div>
        </Header>
      </div>
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
        {dialogOpen && (
          <LoadStreamKeyDialog
            clientId={clientId}
            streamKey={streamKey}
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onConfirm={(clientId, streamKey) => {
              setClientId(clientId);
              setStreamKey(streamKey);
              setDialogOpen(false);
            }}
          />
        )}
        {!dialogOpen && viewerCtx.viewerState.isReady && (
          <div
            className="flex w-full row-start-2 row-span-full col-start-2 col-span-full"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <MonoscopicViewer
              configEnv={Env}
              clientId={clientId}
              streamKey={streamKey}
              viewer={viewerCtx.viewer}
              onSceneReady={viewerCtx.onSceneReady}
              onSelect={async (hit) => {
                const scene = await viewerCtx.viewer.current?.scene();
                if (scene == null) return;

                setSelected(
                  await selectBySuppliedId(
                    scene,
                    hit?.itemSuppliedId?.value ?? '',
                    selected
                  )
                );
              }}
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
    </Layout>
  );
}

export default waitForHydrate(Home);
