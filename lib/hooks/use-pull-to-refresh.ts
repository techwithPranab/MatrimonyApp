'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PullToRefreshOptions {
  readonly threshold?: number;
  readonly resistance?: number;
  readonly onRefresh: () => Promise<void>;
  readonly enabled?: boolean;
}

interface PullToRefreshState {
  readonly isPulling: boolean;
  readonly pullDistance: number;
  readonly isRefreshing: boolean;
  readonly canPull: boolean;
}

export function usePullToRefresh({
  threshold = 80,
  resistance = 2.5,
  onRefresh,
  enabled = true
}: PullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canPull: false
  });

  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const checkCanPull = useCallback(() => {
    if (!elementRef.current) return false;
    const scrollTop = elementRef.current.scrollTop || window.scrollY;
    return scrollTop === 0;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !checkCanPull()) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setState(prev => ({ ...prev, canPull: true }));
  }, [enabled, checkCanPull]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !state.canPull || state.isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const pullDistance = Math.max(0, (currentY.current - startY.current) / resistance);

    if (pullDistance > 0) {
      e.preventDefault();
      isDragging.current = true;
      setState(prev => ({
        ...prev,
        isPulling: true,
        pullDistance
      }));
    }
  }, [enabled, state.canPull, state.isRefreshing, resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isDragging.current) return;

    isDragging.current = false;

    if (state.pullDistance > threshold && !state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: threshold
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      }

      setState(prev => ({
        ...prev,
        isRefreshing: false,
        isPulling: false,
        pullDistance: 0,
        canPull: false
      }));
    } else {
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canPull: false
      }));
    }
  }, [enabled, state.pullDistance, state.isRefreshing, threshold, onRefresh]);

  const setElement = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const pullIndicatorStyle = {
    transform: `translateY(${state.pullDistance}px)`,
    opacity: Math.min(1, state.pullDistance / threshold)
  };

  const shouldShowIndicator = state.isPulling || state.isRefreshing;
  const isOverThreshold = state.pullDistance > threshold;

  return {
    ...state,
    setElement,
    pullIndicatorStyle,
    shouldShowIndicator,
    isOverThreshold
  };
}
