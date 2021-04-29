import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { VertexSceneTree, JSX as ViewerJSX } from "@vertexvis/viewer-react";
import { Row } from "@vertexvis/viewer/dist/types/components/scene-tree/lib/row";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import React from "react";
import { BIData } from "../lib/business-intelligence";
import { LeftDrawerWidth } from "./Layout";
import { updateVisibilityById } from "../lib/scene-items";

interface Props extends ViewerJSX.VertexSceneTree {
  readonly biData: BIData;
  readonly configEnv: Environment;
}

type IconType = "shown" | "hidden";

const useStyles = makeStyles(() => ({
  paper: {
    position: "relative",
    width: LeftDrawerWidth,
  },
}));

export function LeftDrawer({ biData, configEnv, viewer }: Props): JSX.Element {
  const ref = React.useRef<HTMLVertexSceneTreeElement>(null);
  const { paper } = useStyles();

  React.useEffect(() => {
    if (ref.current?.invalidateRows) ref.current?.invalidateRows();
  }, [biData]);

  React.useEffect(() => {
    const localRef = ref.current;
    localRef?.addEventListener("click", clickRow);
    return () => localRef?.removeEventListener("click", clickRow);
  });

  async function clickRow(e: MouseEvent | PointerEvent): Promise<void> {
    const row = await ref?.current?.getRowForEvent(e);
    if (row != null && row.selected) ref.current?.deselectItem(row);
    else ref.current?.selectItem(row);
  }

  async function handleVisibility(row: Row): Promise<void> {
    if (row == null) return;

    await updateVisibilityById({ id: row.id, show: !row.visible, viewer });
  }

  return (
    <Drawer anchor="left" variant="permanent" classes={{ paper }}>
      <VertexSceneTree
        configEnv={configEnv}
        ref={ref}
        rowData={(row: Row) => {
          if (row == null) return { style: "", value: "" };

          const data = {
            toggleVisibility: (e: PointerEvent | MouseEvent) => {
              e.stopPropagation();
              handleVisibility(row);
            },
            visible: row.visible,
            icon: getSvgPath(row.visible ? "shown" : "hidden"),
            style: "",
            value: "",
          };
          const item = biData.items.get(row?.suppliedId ?? "");
          if (item != null) {
            data.style = `background-color: ${item.color}; border-radius: 0.125rem; height: 15px; margin-top: 2px; width: 15px;`;
            data.value = item.value.toString();
          }

          return data;
        }}
        selectionDisabled={true}
        viewer={viewer}
      >
        <Template slot="right">
          {`
          <div style="display: grid; grid-template-columns: 20px 75px 20px;">
            <div style="{{row.data.style}}"></div>
            <div style="font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{row.data.value}}
            </div>
            <div style="height: 16px; width: 16px; fill: #757575" onClick="{{row.data.toggleVisibility}}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="{{row.data.icon}}" />
              </svg>
            </div>
          </div>
          `}
        </Template>
      </VertexSceneTree>
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

export function getSvgPath(icon: IconType): string {
  switch (icon) {
    case "hidden":
      return "M13.35,2.65a.48.48,0,0,0-.7,0l-.78.77a8.71,8.71,0,0,0-8.52.41A6.57,6.57,0,0,0,.51,7.89v.22a6.58,6.58,0,0,0,2.71,4l-.57.58a.49.49,0,0,0,.7.7l10-10A.48.48,0,0,0,13.35,2.65ZM9.73,5.56A3,3,0,0,0,5.56,9.73L3.94,11.35l0,0A5.49,5.49,0,0,1,1.53,8,5.49,5.49,0,0,1,3.9,4.67,7.52,7.52,0,0,1,8,3.5a7.67,7.67,0,0,1,3.12.67Zm3.61-1.2-.72.72A5.45,5.45,0,0,1,14.47,8a5.49,5.49,0,0,1-2.37,3.33A7.52,7.52,0,0,1,8,12.5a8.15,8.15,0,0,1-2.41-.38l-.78.78A8.9,8.9,0,0,0,8,13.5a8.53,8.53,0,0,0,4.65-1.33,6.57,6.57,0,0,0,2.84-4.06V7.89A6.56,6.56,0,0,0,13.34,4.36Z";
    case "shown":
      return "M8,5a3,3,0,1,0,3,3A3,3,0,0,0,8,5Zm4.65-1.17A8.53,8.53,0,0,0,8,2.5,8.53,8.53,0,0,0,3.35,3.83,6.57,6.57,0,0,0,.51,7.89v.22a6.57,6.57,0,0,0,2.84,4.06A8.53,8.53,0,0,0,8,13.5a8.53,8.53,0,0,0,4.65-1.33,6.57,6.57,0,0,0,2.84-4.06V7.89A6.57,6.57,0,0,0,12.65,3.83Zm-.55,7.5A7.52,7.52,0,0,1,8,12.5a7.52,7.52,0,0,1-4.1-1.17A5.49,5.49,0,0,1,1.53,8,5.49,5.49,0,0,1,3.9,4.67,7.52,7.52,0,0,1,8,3.5a7.52,7.52,0,0,1,4.1,1.17A5.49,5.49,0,0,1,14.47,8,5.49,5.49,0,0,1,12.1,11.33Z";
    default:
      return "";
  }
}
