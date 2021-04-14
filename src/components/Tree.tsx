import { VertexSceneTree, JSX as ViewerJSX } from '@vertexvis/viewer-react';
import { Environment } from '@vertexvis/viewer/dist/types/config/environment';
import React, { useEffect, useRef } from 'react';
import { Row } from '../../../vertex-web-sdk/node_modules/@vertexvis/viewer/dist/types/components/scene-tree/lib/row';
import { BIData } from '../lib/business-intelligence';
import { Template } from './Template';

export interface Props extends ViewerJSX.VertexSceneTree {
  readonly biData: BIData;
  readonly configEnv: Environment;
  readonly viewer?: HTMLVertexViewerElement;
}

export function Tree({ biData, configEnv, viewer }: Props): JSX.Element {
  const treeRef = useRef<HTMLVertexSceneTreeElement>(null);

  useEffect(() => {
    if (treeRef.current && treeRef.current.invalidateRows) {
      treeRef.current.invalidateRows();
    }
  }, [biData]);

  return (
    <VertexSceneTree
      configEnv={configEnv}
      ref={treeRef}
      rowData={(row: Row) => {
        const item = biData.items.get(row?.suppliedId ?? '');
        return item
          ? {
              style: `background-color: ${item.color}; border-radius: 0.125rem; height: 15px; margin-top: 2px; width: 15px;`,
              value: item.value.toString(),
            }
          : { style: '', value: '' };
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
  );
}
