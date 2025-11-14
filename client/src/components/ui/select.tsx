import React from 'react';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import MuiMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import { FormControl, InputLabel, Box } from '@mui/material';

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, ...props }, ref) => (
    <MuiSelect
      ref={ref}
      {...props}
    >
      {children}
    </MuiSelect>
  )
);

Select.displayName = 'Select';

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  )
);

SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps {
  placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => (
  <span>{placeholder}</span>
);

SelectValue.displayName = 'SelectValue';

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
);

SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends MuiMenuItemProps {}

const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ children, value, ...props }, ref) => (
    <MuiMenuItem
      ref={ref}
      value={value}
      {...props}
    >
      {children}
    </MuiMenuItem>
  )
);

SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
