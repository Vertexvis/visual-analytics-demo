import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import { VertexSceneTree, JSX as ViewerJSX } from "@vertexvis/viewer-react";
import { Row } from "@vertexvis/viewer/dist/types/components/scene-tree/lib/row";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import React from "react";
import { BIData } from "../lib/business-intelligence";
import { LeftDrawerWidth } from "./Layout";

interface Props extends ViewerJSX.VertexSceneTree {
  readonly biData: BIData;
  readonly configEnv: Environment;
  readonly viewer?: HTMLVertexViewerElement;
}

const useStyles = makeStyles(() => ({
  expanded: {
    height: "100%",
  },
  paper: {
    position: "relative",
    width: LeftDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function LeftDrawer({ biData, configEnv, viewer }: Props): JSX.Element {
  const ref = React.useRef<HTMLVertexSceneTreeElement>(null);
  const { expanded, paper, title } = useStyles();

  React.useEffect(() => {
    if (ref.current && ref.current.invalidateRows) {
      ref.current.invalidateRows();
    }
  }, [biData]);

  return (
    <Drawer anchor="left" variant="permanent" classes={{ paper }}>
      <Accordion classes={{ expanded }} expanded={true}>
        <AccordionSummary>
          <Typography className={title} variant="body2">
            Model
          </Typography>
        </AccordionSummary>
        <Box ml={1}>
          <VertexSceneTree
            configEnv={configEnv}
            ref={ref}
            rowData={(row: Row) => {
              const item = biData.items.get(row?.suppliedId ?? "");
              return item
                ? {
                    style: `background-color: ${item.color}; border-radius: 0.125rem; height: 15px; margin-top: 2px; width: 15px;`,
                    value: item.value.toString(),
                  }
                : { style: "", value: "" };
            }}
            viewer={viewer}
          >
            <Template slot="right">
              {`<div style="display: grid; grid-template-columns: 20px 75px;">
            <div style="{{row.data.style}}"></div>
            <div style="font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{row.data.value}}</div>
          </div>`}
            </Template>
          </VertexSceneTree>
        </Box>
      </Accordion>
    </Drawer>
  );
}

function Template({
  children,
  ...attrs
}: {
  readonly children: string;
  readonly slot: string;
}): JSX.Element {
  return <template {...attrs} dangerouslySetInnerHTML={{ __html: children }} />;
}
