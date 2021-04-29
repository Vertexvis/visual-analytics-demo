import { defineCustomElements } from "@vertexvis/viewer-react";
import React from "react";

interface Viewer {
  readonly onSceneReady: () => void;
  readonly ref: React.MutableRefObject<HTMLVertexViewerElement | null>;
  readonly state: {
    ready: boolean;
    refReady: boolean;
  };
}

export function useViewer(): Viewer {
  const ref = React.useRef<HTMLVertexViewerElement>(null);
  const [state, setState] = React.useState({ ready: false, refReady: false });

  const onSceneReady = React.useCallback(() => {
    setState({ ...state, refReady: ref.current != null });
  }, [state]);

  React.useEffect(() => {
    if (!state.ready) {
      defineCustomElements().then(() => setState({ ...state, ready: true }));
    }
  }, [state]);

  return { ref, onSceneReady, state };
}
