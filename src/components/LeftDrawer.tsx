import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import clsx from "clsx";
import React from "react";
import { AnalyticsData } from "../lib/analytics";
import { LeftDrawerWidth } from "./Layout";
import { SceneTree } from "./SceneTree";

interface Props {
  readonly analyticsData: AnalyticsData;
  readonly configEnv: Environment;
  readonly onClose: () => void;
  readonly open: boolean;
  readonly selected?: string;
  readonly viewerId: string;
}

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    justifyContent: "flex-end",
  },
  paper: {
    position: "relative",
    width: 0,
  },
  paperShift: {
    width: LeftDrawerWidth,
  },
}));

export function LeftDrawer({
  analyticsData,
  configEnv,
  onClose,
  open,
  selected,
  viewerId,
}: Props): JSX.Element {
  const { header, paper, paperShift } = useStyles();

  return (
    <Drawer
      anchor="left"
      classes={{ paper: clsx(paper, { [paperShift]: open }) }}
      open={open}
      variant="persistent"
    >
      <div className={header}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <SceneTree
        analyticsData={analyticsData}
        configEnv={configEnv}
        selected={selected}
        viewerId={viewerId}
      />
    </Drawer>
  );
}
