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
}

export function useViewer(): ViewerContext {
  const ref = useRef<HTMLVertexViewerElement>(null);
  const [state, setState] = useState<ViewerState>({ isReady: false });

  const onSceneReady = useCallback(() => {
    setState({ ...state });
  }, [state]);

  useEffect(() => {
    async function setup(): Promise<void> {
      await defineCustomElements();
      setState({ ...(state ?? {}), isReady: true });
    }

    if (!state.isReady) setup();
  }, [state]);

  return { ref, state, onSceneReady };
}
