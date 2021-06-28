import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import React from "react";
import { useDropzone } from "react-dropzone";

import { CsvData, CsvDataType } from "../components/Analytics";
import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { LeftDrawer } from "../components/LeftDrawer";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import {
  AnalyticsData,
  createAnalyticsData,
  DefaultAnalyticsData,
} from "../lib/analytics";
import {
  DefaultCredentials,
  Env,
  head,
  SampleDataPaths,
  StreamCredentials,
} from "../lib/env";
import { handleCsvUpload, parseCsv } from "../lib/files";
import { useKeyListener } from "../lib/key-listener";
import {
  applyAnalyticsData,
  applyOrClearBySuppliedId,
  clearAll,
  selectByHit,
} from "../lib/scene-items";
import { useViewer } from "../lib/viewer";

const ViewerId = "vertex-viewer-id";

export default function Home(): JSX.Element {
  const router = useRouter();
  const viewer = useViewer();
  const [analyticsData, setAnalyticsData] =
    React.useState<AnalyticsData>(DefaultAnalyticsData);
  const [dataSelected, setDataSelected] = React.useState<
    CsvDataType | undefined
  >("defects");
  const [credentials, setCredentials] = React.useState<
    StreamCredentials | undefined
  >();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  React.useEffect(() => {
    if (!router.isReady) return;

    setCredentials({
      clientId: head(router.query.clientId) || DefaultCredentials.clientId,
      streamKey: head(router.query.streamKey) || DefaultCredentials.streamKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  React.useEffect(() => {
    if (credentials) router.push(encodeCreds(credentials));
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

        setDataSelected(undefined);
        handleCsvUpload(acceptedFiles[0]).then((data) => {
          const ad = createAnalyticsData(data);
          applyAnalyticsData({
            analyticsData: ad,
            viewer: viewer.ref.current,
          }).then(() => setAnalyticsData(ad));
        });
      },
      [viewer.ref]
    ),
    noClick: true,
  });

  async function onCheck(value: string, checked: boolean): Promise<void> {
    const table = analyticsData.table;
    if (table == null) return;

    const val = table.get(value);
    if (val == null) return;

    val.display = checked;
    table.set(value, val);

    setAnalyticsData({ ...analyticsData, table });
    await applyOrClearBySuppliedId({
      apply: checked,
      color: val.color,
      ids: [...analyticsData.items.entries()]
        .filter(([, v]) => v.value === value)
        .map(([k]) => k),
      viewer: viewer.ref.current,
    });
  }

  return router.isReady && credentials ? (
    <Layout
      header={
        <Header
          onMenuClick={() => setDrawerOpen(!drawerOpen)}
          onOpenSceneClick={() => setDialogOpen(true)}
          open={drawerOpen}
        />
      }
      leftDrawer={
        <LeftDrawer
          analyticsData={analyticsData}
          configEnv={Env}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          viewerId={ViewerId}
        />
      }
      main={
        viewer.isReady && (
          <Box height="100%" width="100%" {...getRootProps()}>
            <input {...getInputProps()} />
            <Viewer
              configEnv={Env}
              credentials={credentials}
              onSelect={async (hit) => {
                await selectByHit({ hit: hit, viewer: viewer.ref.current });
              }}
              viewer={viewer.ref}
              viewerId={ViewerId}
            />
          </Box>
        )
      }
      open={drawerOpen}
      rightDrawer={
        <RightDrawer
          analyticsData={analyticsData}
          dataSelected={dataSelected}
          onCheck={onCheck}
          onDataSelected={async (d) => {
            setDataSelected(d);
            const ad = createAnalyticsData(parseCsv(d, CsvData[d]));
            await applyAnalyticsData({
              analyticsData: ad,
              viewer: viewer.ref.current,
            });
            setAnalyticsData(ad);
          }}
          onReset={async () => {
            setAnalyticsData(DefaultAnalyticsData);
            await clearAll({ viewer: viewer.ref.current });
          }}
          sampleDataPath={
            credentials ? SampleDataPaths[credentials.streamKey] : undefined
          }
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
  ) : (
    <></>
  );
}
