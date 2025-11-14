import React from 'react';
import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';

export interface TooltipProps extends MuiTooltipProps {}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, title, ...props }, ref) => (
    <MuiTooltip ref={ref} title={title} {...props}>
      {children as React.ReactElement}
    </MuiTooltip>
  )
);

Tooltip.displayName = 'Tooltip';

export const TooltipProvider = ({ children }: any) => children;
TooltipProvider.displayName = 'TooltipProvider';

export { Tooltip };
