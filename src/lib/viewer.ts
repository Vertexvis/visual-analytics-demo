import { defineCustomElements } from '@vertexvis/viewer-react';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface ViewerContext {
  readonly ref: MutableRefObject<HTMLVertexViewerElement | null>;
  readonly onSceneReady: () => void;
  readonly state: ViewerState;
}

interface ViewerState {
  readonly isReady: boolean;
  readonly isRefReady: boolean;
}

export function useViewer(): ViewerContext {
  const ref = useRef<HTMLVertexViewerElement>(null);
  const [state, setState] = useState<ViewerState>({
    isReady: false,
    isRefReady: false,
  });

  const onSceneReady = useCallback(() => {
    setState({ ...state, isRefReady: ref.current != null });
  }, [ref.current]);

  useEffect(() => {
    if (!state.isReady) {
      defineCustomElements().then(() => setState({ ...state, isReady: true }));
    }
  }, [state]);

  return { ref, state, onSceneReady };
}
