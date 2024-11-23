import type { DependencyList } from 'react';
import { useCallback, useRef } from 'react';

export default function useIntersectionObserver(callback: () => void, deps: DependencyList) {
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (deps.every(Boolean)) {
        observer.current?.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) callback();
        });

        if (node) observer.current.observe(node);
      }
    },
    [deps, callback],
  );

  return ref;
}
