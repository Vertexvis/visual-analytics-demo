import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import React from "react";

const DenseToolbarHeight = 48;
export const LeftDrawerWidth = 300;
export const RightDrawerWidth = 320;

interface Props {
  readonly children: React.ReactNode;
  readonly header: React.ReactNode;
  readonly leftDrawer: React.ReactNode;
  readonly main: React.ReactNode;
  readonly open: boolean;
  readonly rightDrawer: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginRight: RightDrawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: `calc(100% - ${RightDrawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      width: `100%`,
    },
  },
  appBarShift: {
    marginLeft: LeftDrawerWidth,
    marginRight: RightDrawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      width: `100%`,
    },
  },
  content: {
    height: `calc(100% - ${DenseToolbarHeight}px)`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: `calc(100% - ${RightDrawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: `100%`,
    },
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: `100%`,
    },
  },
}));

export function Layout({
  children,
  header,
  leftDrawer,
  main,
  open,
  rightDrawer,
}: Props): JSX.Element {
  const { appBar, appBarShift, content, contentShift } = useStyles();

  return (
    <Box height="100vh" display="flex">
      <AppBar
        position="fixed"
        elevation={1}
        color="default"
        className={clsx(appBar, {
          [appBarShift]: open,
        })}
      >
        <Toolbar variant="dense">{header}</Toolbar>
      </AppBar>
      <Hidden smDown>{leftDrawer}</Hidden>
      <main className={clsx(content, { [contentShift]: open })}>
        <Box minHeight={`${DenseToolbarHeight}px`} />
        {main}
      </main>
      <Hidden smDown>{rightDrawer}</Hidden>
      {children}
    </Box>
  );
}
