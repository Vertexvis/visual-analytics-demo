import { defineCustomElements } from "@vertexvis/viewer-react";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Viewer {
  readonly isReady: boolean;
  readonly isRefReady: boolean;
  readonly onSceneReady: () => void;
  readonly ref: MutableRefObject<HTMLVertexViewerElement | null>;
}

export function useViewer(): Viewer {
  const ref = useRef<HTMLVertexViewerElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRefReady, setIsRefReady] = useState(false);

  const onSceneReady = useCallback(() => {
    setIsRefReady(ref.current != null);
  }, [ref.current]);

  useEffect(() => {
    if (!isReady) {
      defineCustomElements().then(() => setIsReady(true));
    }
  }, []);

  return { isReady, isRefReady, ref, onSceneReady };
}
