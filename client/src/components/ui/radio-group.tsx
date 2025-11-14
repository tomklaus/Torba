import React from 'react';
import MuiRadioGroup, { RadioGroupProps as MuiRadioGroupProps } from '@mui/material/RadioGroup';
import MuiRadio, { RadioProps as MuiRadioProps } from '@mui/material/Radio';
import { FormControlLabel } from '@mui/material';

export interface RadioGroupProps extends MuiRadioGroupProps {}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, ...props }, ref) => (
    <MuiRadioGroup
      ref={ref}
      {...props}
    >
      {children}
    </MuiRadioGroup>
  )
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends MuiRadioProps {
  label?: React.ReactNode;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ label, value, ...props }, ref) => {
    if (label) {
      return (
        <FormControlLabel
          value={value}
          control={<MuiRadio ref={ref} {...props} />}
          label={label}
        />
      );
    }
    return (
      <MuiRadio
        ref={ref}
        value={value}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
