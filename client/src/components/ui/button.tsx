import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | MuiButtonProps['variant'];
}

const variantMap: Record<string, MuiButtonProps['variant']> = {
  default: 'contained',
  destructive: 'contained',
  outline: 'outlined',
  secondary: 'contained',
  ghost: 'text',
  link: 'text',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', ...props }, ref) => {
    const muiVariant = variantMap[variant as string] || 'contained';
    const isDestructive = variant === 'destructive';
    
    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        color={isDestructive ? 'error' : 'primary'}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
