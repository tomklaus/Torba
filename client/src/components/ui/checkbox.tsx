import React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'variant'> {}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ ...props }, ref) => (
    <MuiCheckbox
      ref={ref}
      {...props}
    />
  )
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
