import { VertexSceneTree } from "@vertexvis/viewer-react";
import { Row } from "@vertexvis/viewer/dist/types/components/scene-tree/lib/row";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import React from "react";
import { AnalyticsData } from "../lib/analytics";

interface Props {
  readonly analyticsData: AnalyticsData;
  readonly configEnv: Environment;
  readonly selected?: string;
  readonly viewerId: string;
}

export function SceneTree({
  analyticsData,
  configEnv,
  viewerId,
}: Props): JSX.Element {
  const ref = React.useRef<HTMLVertexSceneTreeElement>(null);

  React.useEffect(() => {
    if (ref.current?.invalidateRows) ref.current?.invalidateRows();
  }, [analyticsData]);

  // React.useEffect(() => {
  //   if (selected) ref.current?.scrollToItem(selected);
  // }, [selected]);

  return (
    <VertexSceneTree
      configEnv={configEnv}
      ref={ref}
      rowData={(row: Row) => {
        const item = analyticsData.items.get(
          row?.node?.suppliedId?.value ?? ""
        );
        return item != null
          ? {
              style: `background-color: ${item.color}; border-radius: 0.125rem; flex: 1; height: 15px; margin-top: 2px; margin-right: 5px; width: 15px;`,
              value: item.value.toString(),
            }
          : { style: "", value: "" };
      }}
      viewerSelector={`#${viewerId}`}
    >
      <Template>
        {`
          <vertex-scene-tree-row prop:node={{row.node}}>
            <div slot="right-gutter" style="display: flex;">
              <div attr:style="{{row.data.style}}"></div>
              <div style="font-size: 0.75rem; margin-right: 5px; min-width: 75px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{row.data.value}}
              </div>
            </div>
          </vertex-scene-tree-row>
          `}
      </Template>
    </VertexSceneTree>
  );
}

function Template({ children }: { readonly children: string }): JSX.Element {
  return <template dangerouslySetInnerHTML={{ __html: children }} />;
}
