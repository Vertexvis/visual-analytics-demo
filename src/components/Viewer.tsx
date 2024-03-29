/* @jsx jsx */ /** @jsxRuntime classic */ import { jsx } from "@emotion/react";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { JSX as ViewerJSX } from "@vertexvis/viewer";
import { VertexViewer } from "@vertexvis/viewer-react";
import React from "react";

import { StreamCredentials } from "../lib/env";

interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
  readonly viewerId: string;
}

type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

export const Viewer = onTap(UnwrappedViewer);

function UnwrappedViewer({
  credentials,
  viewer,
  viewerId,
  ...props
}: ViewerProps): JSX.Element {
  return (
    <VertexViewer
      clientId={credentials.clientId}
      css={{ height: "100%", width: "100%" }}
      id={viewerId}
      ref={viewer}
      src={`urn:vertex:stream-key:${credentials.streamKey}`}
      {...props}
    />
  );
}

interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }: P & OnSelectProps) {
    return (
      <WrappedViewer
        viewer={viewer}
        {...props}
        onTap={async (e) => {
          if (props.onTap) props.onTap(e);

          if (!e.defaultPrevented) {
            const scene = await viewer.current?.scene();
            const raycaster = scene?.raycaster();

            if (raycaster != null) {
              const res = await raycaster.hitItems(e.detail.position, {
                includeMetadata: true,
              });
              const hit = (res?.hits ?? [])[0];
              onSelect(hit);
            }
          }
        }}
      />
    );
  };
}
