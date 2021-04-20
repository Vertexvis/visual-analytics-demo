import Box from "@material-ui/core/Box";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Props as LayoutProps } from "../components/Layout";
import { encodeCreds, OpenButton, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { LeftDrawer } from "../components/LeftDrawer";
import { Viewer } from "../components/Viewer";
import {
  createBIData,
  DefaultBIData,
  BIData,
} from "../lib/business-intelligence";
import { DefaultClientId, DefaultStreamKey, Env } from "../lib/env";
import { useKeyListener } from "../lib/key-listener";
import { handleCsvUpload } from "../lib/file-upload";
import {
  applyBIData,
  applyOrClearBySuppliedId,
  clearAll,
  selectByHit,
} from "../lib/scene-items";
import {
  getStoredCreds,
  setStoredCreds,
  StreamCredentials,
} from "../lib/storage";
import { useViewer } from "../lib/viewer";

const Layout = dynamic<LayoutProps>(
  () => import("../components/Layout").then((m) => m.Layout),
  { ssr: false }
);

export default function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const stored = getStoredCreds();
  const [credentials, setCredentials] = React.useState<StreamCredentials>({
    clientId: queryId?.toString() || stored.clientId || DefaultClientId,
    streamKey: queryKey?.toString() || stored.streamKey || DefaultStreamKey,
  });

  React.useEffect(() => {
    router.push(encodeCreds(credentials));
    setStoredCreds(credentials);
  }, [credentials]);

  const keys = useKeyListener();
  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [keys]);

  const viewer = useViewer();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [biData, setBIData] = React.useState<BIData>(DefaultBIData);
  const ready = credentials.clientId && credentials.streamKey && viewer.isReady;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: React.useCallback((acceptedFiles) => {
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

  return (
    <Layout
      header={<OpenButton onClick={() => setDialogOpen(true)} />}
      leftDrawer={
        <LeftDrawer
          biData={biData}
          configEnv={Env}
          viewer={viewer.ref.current ?? undefined}
        />
      }
      main={
        ready && (
          <Box height="100%" width="100%" {...getRootProps()}>
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
          </Box>
        )
      }
      rightDrawer={
        <RightDrawer
          biData={biData}
          onCheck={onCheck}
          onReset={async () => {
            setBIData(DefaultBIData);
            await clearAll({ viewer: viewer.ref.current });
          }}
        />
      }
    >
      {dialogOpen && (
        <OpenDialog
          credentials={credentials}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCredentials(cs);
            setDialogOpen(false);
          }}
          open={dialogOpen}
        />
      )}
    </Layout>
  );
}
