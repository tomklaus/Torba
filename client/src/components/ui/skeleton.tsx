import React from 'react';
import MuiSkeleton, { SkeletonProps as MuiSkeletonProps } from '@mui/material/Skeleton';

export interface SkeletonProps extends MuiSkeletonProps {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ ...props }, ref) => (
    <MuiSkeleton ref={ref} {...props} />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
