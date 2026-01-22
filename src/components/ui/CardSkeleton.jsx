import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * CardSkeleton
 * - Displays one or more skeleton cards that mimic a content card layout
 * - Props:
 *   - count (number) optional, default 1
 */
export default function CardSkeleton({ count = 1 }) {
  const cards = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-start gap-4">
            {/* avatar */}
            <div className="flex-shrink-0">
              <Skeleton circle={true} height={56} width={56} />
            </div>

            {/* content */}
            <div className="flex-1">
              <h3 className="mb-2">
                <Skeleton width={`60%`} height={16} />
              </h3>

              <p className="mb-3">
                <Skeleton count={2} />
              </p>

              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Skeleton height={32} />
                </div>
                <div className="flex-1">
                  <Skeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
