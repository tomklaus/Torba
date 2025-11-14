import React from 'react';
import MuiLinearProgress, { LinearProgressProps as MuiLinearProgressProps } from '@mui/material/LinearProgress';
import { Box } from '@mui/material';

export interface ProgressProps extends MuiLinearProgressProps {}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ ...props }, ref) => (
    <Box ref={ref} sx={{ width: '100%' }}>
      <MuiLinearProgress {...props} />
    </Box>
  )
);

Progress.displayName = 'Progress';

export { Progress };
