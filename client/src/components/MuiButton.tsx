import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: MuiButtonProps['variant'];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <MuiButton ref={ref} {...props}>
      {children}
    </MuiButton>
  )
);

Button.displayName = 'Button';

export { Button };
