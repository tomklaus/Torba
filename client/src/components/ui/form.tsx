import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormLabel, FormHelperText, FormControlLabel, FormGroup, Box } from '@mui/material';

export const Form = ({ children, ...props }: any) => (
  <form {...props}>
    {children}
  </form>
);

export const FormField = ({ name, control, render }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      render={render}
    />
  );
};

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ children, ...props }, ref) => (
    <FormControl fullWidth variant="outlined" ref={ref} {...props} sx={{ mb: 2 }}>
      {children}
    </FormControl>
  )
);

FormItem.displayName = 'FormItem';

export interface FormLabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

export const FormLabelComponent = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, ...props }, ref) => (
    <FormLabel ref={ref} {...props}>
      {children}
    </FormLabel>
  )
);

FormLabelComponent.displayName = 'FormLabel';

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormControlComponent = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
);

FormControlComponent.displayName = 'FormControl';

export interface FormMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  ({ children, ...props }, ref) => (
    <FormHelperText
      ref={ref}
      error
      sx={{ fontSize: '0.75rem', mt: 0.5 }}
      {...props}
    >
      {children}
    </FormHelperText>
  )
);

FormMessage.displayName = 'FormMessage';

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormDescription = React.forwardRef<HTMLDivElement, FormDescriptionProps>(
  ({ children, ...props }, ref) => (
    <FormHelperText
      ref={ref}
      sx={{ fontSize: '0.75rem', mt: 0.5 }}
      {...props}
    >
      {children}
    </FormHelperText>
  )
);

FormDescription.displayName = 'FormDescription';

export {
  FormLabelComponent as FormLabel,
  FormControlComponent as FormControl,
};
