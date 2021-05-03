import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from "react";

interface Props {
  onMenuClick: () => void;
  onOpenSceneClick: () => void;
  open: boolean;
}

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}));

export function Header({
  onMenuClick,
  onOpenSceneClick,
  open,
}: Props): JSX.Element {
  const { menuButton, hide } = useStyles();

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <div>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          className={clsx(menuButton, open && hide)}
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
      </div>
      <Link
        href="https://github.com/Vertexvis/business-intelligence-demo"
        rel="noreferrer"
        style={{ alignSelf: "center" }}
        target="_blank"
      >
        View on GitHub
      </Link>
    </Box>
  );
}
