import React from 'react';
import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';

export interface BadgeProps extends MuiChipProps {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, label, ...props }, ref) => (
    <MuiChip
      ref={ref}
      label={label || children}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';

export { Badge };
