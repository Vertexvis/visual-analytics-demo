import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { StreamCredsDialog } from '../components/StreamCredsDialog';
import { useDropzone } from 'react-dropzone';
import { RightSidebar } from '../components/RightSidebar';
import { onTap, Viewer } from '../components/Viewer';
import {
  applyBIData,
  applyOrClearBySuppliedId,
  clearAll,
  selectByHit,
} from '../lib/scene-items';
import { Env } from '../lib/env';
import {
  createBIData,
  DefaultBIData,
  BIData,
} from '../lib/business-intelligence';
import { handleCsvUpload } from '../lib/file-upload';
import { waitForHydrate } from '../lib/nextjs';
import { getStoredCreds, setStoredCreds, StreamCreds } from '../lib/storage';
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
  const storedCreds = getStoredCreds();
  const viewerCtx = useViewer();

  const [creds, setCreds] = useState<StreamCreds>({
    clientId:
      queryId?.toString() ||
      storedCreds.clientId ||
      '08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA',
    streamKey:
      queryKey?.toString() ||
      storedCreds.streamKey ||
      'U9cSWVb7fvS9k-NQcT28uZG6wtm6xmiG0ctU',
  });
  const [dialogOpen, setDialogOpen] = useState(
    !creds.clientId || !creds.streamKey
  );
  const [biData, setBIData] = useState<BIData>(DefaultBIData);

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        creds.clientId
      )}&streamKey=${encodeURIComponent(creds.streamKey)}`
    );
    setStoredCreds(creds);
  }, [creds]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback((acceptedFiles) => {
      if (viewerCtx.viewer.current == null) return;

      const fileName = acceptedFiles[0];
      viewerCtx.viewer.current.scene().then((s) => {
        handleCsvUpload(fileName).then((data) => {
          const bi = createBIData(data);
          applyBIData({ biData: bi, scene: s }).then(() => setBIData(bi));
        });
      });
    }, []),
    noClick: true,
  });

  async function onCheck(value: string, checked: boolean): Promise<void> {
    const table = biData.table;
    if (table == null) return;

    const val = table.get(value);
    if (val == null) return;

    val.display = checked;
    table.set(value, val);

    setBIData({ ...biData, table });
    await applyOrClearBySuppliedId({
      apply: checked,
      color: val.color,
      ids: [...biData.items.entries()]
        .filter(([, v]) => v.value === value)
        .map(([k]) => k),
      scene: await viewerCtx.viewer.current?.scene(),
    });
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
        {!dialogOpen && viewerCtx.viewerState.isReady && (
          <div
            className="flex w-full row-start-2 row-span-full col-start-2 col-span-full"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <MonoscopicViewer
              configEnv={Env}
              creds={creds}
              viewer={viewerCtx.viewer}
              onSceneReady={viewerCtx.onSceneReady}
              onSelect={async (hit) =>
                await selectByHit({
                  hit: hit,
                  scene: await viewerCtx.viewer.current?.scene(),
                })
              }
            />
          </div>
        )}
        <RightSidebar
          biData={biData}
          onCheck={onCheck}
          onReset={async () => {
            setBIData(DefaultBIData);
            await clearAll({ scene: await viewerCtx.viewer.current?.scene() });
          }}
        />
      </div>
      {dialogOpen && (
        <StreamCredsDialog
          creds={creds}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCreds(cs);
            setDialogOpen(false);
          }}
        />
      )}
    </Layout>
  );
}

export default waitForHydrate(Home);
