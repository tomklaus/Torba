import React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export interface InputProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ ...props }, ref) => (
    <MuiTextField
      ref={ref}
      variant="outlined"
      {...props}
    />
  )
);

Input.displayName = 'Input';

export { Input };
