import { makeStyles } from "@material-ui/core/styles";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { VertexViewer, JSX as ViewerJSX } from "@vertexvis/viewer-react";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import React from "react";
import { StreamCredentials } from "../lib/storage";

interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly configEnv: Environment;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
  },
}));

export const Viewer = onTap(UnwrappedViewer);

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  const { root } = useStyles();

  return (
    <VertexViewer
      className={root}
      clientId={credentials.clientId}
      ref={viewer}
      src={`urn:vertexvis:stream-key:${credentials.streamKey}`}
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
