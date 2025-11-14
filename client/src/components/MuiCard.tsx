import React from 'react';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import CardContent, { CardContentProps as MuiCardContentProps } from '@mui/material/CardContent';
import CardHeader, { CardHeaderProps as MuiCardHeaderProps } from '@mui/material/CardHeader';
import CardActions, { CardActionsProps as MuiCardActionsProps } from '@mui/material/CardActions';
import Box from '@mui/material/Box';

export interface CardProps extends MuiCardProps {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <MuiCard ref={ref} {...props}>
      {children}
    </MuiCard>
  )
);

Card.displayName = 'Card';

export interface CardHeaderProps extends MuiCardHeaderProps {}

const CardHeaderComponent = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ ...props }, ref) => <CardHeader ref={ref} {...props} />
);

CardHeaderComponent.displayName = 'CardHeader';

export interface CardContentProps extends MuiCardContentProps {}

const CardContentComponent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => (
    <CardContent ref={ref} {...props}>
      {children}
    </CardContent>
  )
);

CardContentComponent.displayName = 'CardContent';

export interface CardActionsProps extends MuiCardActionsProps {}

const CardActionsComponent = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, ...props }, ref) => (
    <CardActions ref={ref} {...props}>
      {children}
    </CardActions>
  )
);

CardActionsComponent.displayName = 'CardActions';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <Box
      ref={ref}
      sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}
      className={className}
      {...props}
    >
      {children}
    </Box>
  )
);

CardDescription.displayName = 'CardDescription';

interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <Box
      ref={ref}
      component="h2"
      sx={{ fontSize: '1.5rem', fontWeight: 600 }}
      className={className}
      {...props}
    >
      {children}
    </Box>
  )
);

CardTitle.displayName = 'CardTitle';

export {
  Card,
  CardHeaderComponent as CardHeader,
  CardContentComponent as CardContent,
  CardActionsComponent as CardActions,
  CardDescription,
  CardTitle,
};
