import React from 'react';
import MuiFormLabel, { FormLabelProps as MuiFormLabelProps } from '@mui/material/FormLabel';

export interface LabelProps extends MuiFormLabelProps {}

const Label = React.forwardRef<HTMLDivElement, LabelProps>(
  ({ children, ...props }, ref) => (
    <MuiFormLabel ref={ref} {...props}>
      {children}
    </MuiFormLabel>
  )
);

Label.displayName = 'Label';

export { Label };
