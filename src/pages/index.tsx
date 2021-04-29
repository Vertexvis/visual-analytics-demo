import Box from "@material-ui/core/Box";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Header } from "../components/Header";
import { Props as LayoutProps } from "../components/Layout";
import { LeftDrawer } from "../components/LeftDrawer";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
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
  const viewer = useViewer();
  const [biData, setBIData] = React.useState<BIData>(DefaultBIData);
  const [credentials, setCredentials] = React.useState<
    StreamCredentials | undefined
  >();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredCreds();
    const { clientId: qId, streamKey: qKey } = router.query;
    setCredentials({
      clientId: head(qId) ?? stored?.clientId ?? DefaultClientId,
      streamKey: head(qKey) ?? stored?.streamKey ?? DefaultStreamKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  React.useEffect(() => {
    if (!credentials) return;

    router.push(encodeCreds(credentials));
    setStoredCreds(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  const keys = useKeyListener();
  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [dialogOpen, keys]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: React.useCallback(
      (acceptedFiles) => {
        if (viewer.ref.current == null) return;

        handleCsvUpload(acceptedFiles[0]).then((data) => {
          const bi = createBIData(data);
          applyBIData({ biData: bi, viewer: viewer.ref.current }).then(() =>
            setBIData(bi)
          );
        });
      },
      [viewer.ref]
    ),
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
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      leftDrawer={
        <LeftDrawer
          biData={biData}
          configEnv={Env}
          viewer={viewer.ref.current}
        />
      }
      main={
        credentials &&
        viewer.state.ready && (
          <Box height="100%" width="100%" {...getRootProps()}>
            <input {...getInputProps()} />
            <Viewer
              configEnv={Env}
              credentials={credentials}
              viewer={viewer.ref}
              onSceneReady={() => {
                viewer.onSceneReady();
              }}
              onSelect={async (hit) => {
                await selectByHit({ hit: hit, viewer: viewer.ref.current });
              }}
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
      {credentials && dialogOpen && (
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

function head<T>(items?: T | T[]): T | undefined {
  return items ? (Array.isArray(items) ? items[0] : items) : undefined;
}
