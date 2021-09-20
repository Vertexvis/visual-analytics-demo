import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { Environment } from "@vertexvis/viewer";
import React from "react";

import { AnalyticsData } from "../lib/analytics";
import { LeftDrawerWidth } from "./Layout";
import { SceneTree } from "./SceneTree";

interface Props {
  readonly analyticsData: AnalyticsData;
  readonly configEnv: Environment;
  readonly onClose: () => void;
  readonly open: boolean;
  readonly viewerId: string;
}

export function LeftDrawer({
  analyticsData,
  configEnv,
  onClose,
  open,
  viewerId,
}: Props): JSX.Element {
  return (
    <Drawer
      anchor="left"
      open={open}
      variant="persistent"
      sx={{
        [`& .${drawerClasses.paper}`]: { position: "relative", width: 0 },
        [`& .${drawerClasses.paperAnchorLeft}`]: { width: LeftDrawerWidth },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          justifyContent: "flex-end",
        }}
      >
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <SceneTree
        analyticsData={analyticsData}
        configEnv={configEnv}
        viewerId={viewerId}
      />
    </Drawer>
  );
}
