import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { encode, OpenButton, OpenDialog } from '../components/OpenSceneDialog';
import { RightSidebar } from '../components/RightSidebar';
import { Tree } from '../components/Tree';
import { Viewer } from '../components/Viewer';
import { VertexLogo } from '../components/VertexLogo';
import {
  createBIData,
  DefaultBIData,
  BIData,
} from '../lib/business-intelligence';
import { DefaultClientId, DefaultStreamKey, Env } from '../lib/env';
import { handleCsvUpload } from '../lib/file-upload';
import {
  applyBIData,
  applyOrClearBySuppliedId,
  clearAll,
  selectByHit,
} from '../lib/scene-items';
import {
  getStoredCreds,
  setStoredCreds,
  StreamCredentials,
} from '../lib/storage';
import { useViewer } from '../lib/viewer';

const Layout = dynamic<LayoutProps>(
  () => import('../components/Layout').then((m) => m.Layout),
  { ssr: false }
);

export default function Home(): JSX.Element {
  const viewer = useViewer();
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const stored = getStoredCreds();
  const [credentials, setCredentials] = useState<StreamCredentials>({
    clientId: queryId?.toString() || stored.clientId || DefaultClientId,
    streamKey: queryKey?.toString() || stored.streamKey || DefaultStreamKey,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [biData, setBIData] = useState<BIData>(DefaultBIData);

  useEffect(() => {
    router.push(encode(credentials));
    setStoredCreds(credentials);
  }, [credentials]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback((acceptedFiles) => {
      if (viewer.ref.current == null) return;

      handleCsvUpload(acceptedFiles[0]).then((data) => {
        const bi = createBIData(data);
        applyBIData({ biData: bi, viewer: viewer.ref.current }).then(() =>
          setBIData(bi)
        );
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
      viewer: viewer.ref.current,
    });
  }

  return router.isReady ? (
    <Layout title="Vertex Business Intelligence">
      <div className="col-span-full">
        <Header logo={<VertexLogo />}>
          <OpenButton onClick={() => setDialogOpen(true)} />
        </Header>
      </div>
      {dialogOpen && (
        <OpenDialog
          creds={credentials}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCredentials(cs);
            setDialogOpen(false);
          }}
        />
      )}
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
        <Tree
          biData={biData}
          configEnv={Env}
          viewer={viewer.ref.current ?? undefined}
        />
        {credentials.clientId && credentials.streamKey && viewer.state.isReady && (
          <div className="w-0 flex-grow ml-auto relative" {...getRootProps()}>
            <input {...getInputProps()} />
            <Viewer
              configEnv={Env}
              credentials={credentials}
              viewer={viewer.ref}
              onSceneReady={viewer.onSceneReady}
              onSelect={async (hit) =>
                await selectByHit({ hit: hit, viewer: viewer.ref.current })
              }
            />
          </div>
        )}
        <RightSidebar
          biData={biData}
          onCheck={onCheck}
          onReset={async () => {
            setBIData(DefaultBIData);
            await clearAll({ viewer: viewer.ref.current });
          }}
        />
      </div>
    </Layout>
  ) : (
    <></>
  );
}
