import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { VertexViewer, JSX as ViewerJSX } from '@vertexvis/viewer-react';
import { Environment } from '@vertexvis/viewer/dist/types/config/environment';
import React, {
  ComponentType,
  FunctionComponent,
  MutableRefObject,
  RefAttributes,
} from 'react';
import { StreamCredentials } from '../lib/storage';

export interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly configEnv: Environment;
  readonly viewer: MutableRefObject<HTMLVertexViewerElement | null>;
}

export type ViewerComponentType = ComponentType<
  ViewerProps & RefAttributes<HTMLVertexViewerElement>
>;

export type HOCViewerProps = RefAttributes<HTMLVertexViewerElement>;

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  return (
    <VertexViewer
      className="w-full h-full"
      clientId={credentials.clientId}
      ref={viewer}
      src={`urn:vertexvis:stream-key:${credentials.streamKey}`}
      {...props}
    />
  );
}

export const Viewer = onTap(UnwrappedViewer);

export interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

export function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }) {
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
