import React from 'react';
import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

export interface AlertProps extends Omit<MuiAlertProps, 'variant'> {
  variant?: 'filled' | 'outlined' | 'standard';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'standard', ...props }, ref) => (
    <MuiAlert ref={ref} variant={variant} {...props}>
      {children}
    </MuiAlert>
  )
);

Alert.displayName = 'Alert';

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
);

AlertDescription.displayName = 'AlertDescription';

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertTitleComponent = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ children, ...props }, ref) => (
    <AlertTitle ref={ref} {...props}>
      {children}
    </AlertTitle>
  )
);

AlertTitleComponent.displayName = 'AlertTitle';

export { Alert, AlertDescription, AlertTitleComponent as AlertTitle };
