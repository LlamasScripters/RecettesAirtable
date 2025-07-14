import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  loaderRef: React.RefObject<HTMLDivElement>;
  isIntersecting: boolean;
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = options;

  const loaderRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(loader);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, threshold, rootMargin, enabled]);

  return {
    loaderRef,
    isIntersecting
  };
}