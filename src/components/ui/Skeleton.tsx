import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
