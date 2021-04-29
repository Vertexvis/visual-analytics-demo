import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import React from "react";
import { BIData } from "../lib/business-intelligence";
import { LeftDrawerWidth } from "./Layout";
import { SceneTree } from "./SceneTree";

interface Props {
  readonly biData: BIData;
  readonly configEnv: Environment;
  readonly viewer?: HTMLVertexViewerElement | null;
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "relative",
    width: LeftDrawerWidth,
  },
}));

export function LeftDrawer({ biData, configEnv, viewer }: Props): JSX.Element {
  const { paper } = useStyles();

  return (
    <Drawer anchor="left" variant="permanent" classes={{ paper }}>
      <SceneTree biData={biData} configEnv={configEnv} viewer={viewer} />
    </Drawer>
  );
}
