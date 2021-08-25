import { delay } from "@vertexvis/api-client-node";
import { Environment } from "@vertexvis/viewer";
import { Row } from "@vertexvis/viewer/dist/types/components/scene-tree/lib/row";
import { VertexSceneTree } from "@vertexvis/viewer-react";
import React from "react";

import { AnalyticsData } from "../lib/analytics";

interface Props {
  readonly analyticsData: AnalyticsData;
  readonly configEnv: Environment;
  readonly viewerId: string;
}

export function SceneTree({
  analyticsData,
  configEnv,
  viewerId,
}: Props): JSX.Element {
  const ref = React.useRef<HTMLVertexSceneTreeElement>(null);

  React.useEffect(() => {
    async function expandRoot() {
      await delay(1500);
      try {
        if (ref.current?.expandItem) await ref.current?.expandItem(0);
      } catch {
        // Ignore
      }
    }

    const effectRef = ref.current;
    effectRef?.addEventListener("click", clickRow);
    expandRoot();

    return () => effectRef?.removeEventListener("click", clickRow);
  }, [ref]);

  React.useEffect(() => {
    if (ref.current?.invalidateRows) ref.current?.invalidateRows();
  }, [analyticsData]);

  const clickRow = async (e: MouseEvent): Promise<void> => {
    const row = await ref?.current?.getRowForEvent(e);
    if (row?.node == null) return;

    console.log(
      `Selected ${row.node.suppliedId?.value ?? row.node.id?.hex},${
        row.node.name
      }`
    );
  };

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
