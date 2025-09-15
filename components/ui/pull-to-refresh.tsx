'use client';

import React from 'react';
import { usePullToRefresh } from '../../lib/hooks/use-pull-to-refresh';

// Pull to refresh indicator component
interface PullToRefreshIndicatorProps {
  readonly isRefreshing: boolean;
  readonly isOverThreshold: boolean;
  readonly style: React.CSSProperties;
}

export function PullToRefreshIndicator({ 
  isRefreshing, 
  isOverThreshold, 
  style 
}: PullToRefreshIndicatorProps) {
  return (
    <div
      style={style}
      className="flex items-center justify-center h-16 text-gray-600 transition-transform duration-200"
    >
      {isRefreshing ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm">Refreshing...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div 
            className={`transform transition-transform duration-200 ${
              isOverThreshold ? 'rotate-180' : 'rotate-0'
            }`}
          >
            ↓
          </div>
          <span className="text-sm">
            {isOverThreshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}
    </div>
  );
}

// HOC for easy integration
interface WithPullToRefreshProps {
  readonly onRefresh: () => Promise<void>;
  readonly enabled?: boolean;
  readonly children: React.ReactNode;
}

export function WithPullToRefresh({ 
  onRefresh, 
  enabled = true, 
  children 
}: WithPullToRefreshProps) {
  const {
    setElement,
    shouldShowIndicator,
    isRefreshing,
    isOverThreshold,
    pullIndicatorStyle
  } = usePullToRefresh({ onRefresh, enabled });

  return (
    <div ref={setElement} className="relative overflow-hidden">
      {shouldShowIndicator && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <PullToRefreshIndicator
            isRefreshing={isRefreshing}
            isOverThreshold={isOverThreshold}
            style={pullIndicatorStyle}
          />
        </div>
      )}
      <div
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.min(80, (() => {
            const match = /\d+/.exec(pullIndicatorStyle.transform);
            return parseInt(match?.[0] || '0');
          })())}px)` : 'none',
          transition: isRefreshing ? 'transform 0.3s ease' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}
