import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import React from "react";

interface Props {
  onMenuClick: () => void;
  onOpenSceneClick: () => void;
  open: boolean;
}

export function Header({
  onMenuClick,
  onOpenSceneClick,
  open,
}: Props): JSX.Element {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box sx={{ alignItems: "center", display: "flex" }}>
        <IconButton
          color="inherit"
          onClick={onMenuClick}
          edge="start"
          sx={{ display: open ? "none" : "block", mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Button
          color="primary"
          onClick={() => onOpenSceneClick()}
          variant="contained"
        >
          Open Scene
        </Button>
      </Box>
      <Link
        href="https://github.com/Vertexvis/visual-analytics-demo"
        rel="noreferrer"
        sx={{ alignSelf: "center" }}
        target="_blank"
      >
        View on GitHub
      </Link>
    </Box>
  );
}
