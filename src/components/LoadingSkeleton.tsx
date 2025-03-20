import React from 'react';

interface LoadingSkeletonProps {
  count?: number; // Number of skeleton items to show
  height?: string; // Custom height for skeleton items
}

/**
 * A reusable loading skeleton component that shows animated placeholder items
 * @param count - Number of skeleton items to show (default: 3)
 * @param height - Height of each skeleton item (default: 'h-8')
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  count = 3, 
  height = 'h-8' 
}) => (
  <div className="space-y-4 p-4">
    {[...Array(count)].map((_, index) => (
      <div 
        key={index} 
        className={`${height} bg-secondary rounded-md animate-pulse`} 
      />
    ))}
  </div>
);

export default LoadingSkeleton; 