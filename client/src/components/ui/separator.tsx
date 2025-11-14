import React from 'react';
import MuiDivider, { DividerProps as MuiDividerProps } from '@mui/material/Divider';

export interface SeparatorProps extends MuiDividerProps {}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ ...props }, ref) => (
    <MuiDivider ref={ref} {...props} />
  )
);

Separator.displayName = 'Separator';

export { Separator };
