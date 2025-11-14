import React from 'react';
import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import { Box } from '@mui/material';

export interface AvatarProps extends MuiAvatarProps {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, src, alt, ...props }, ref) => (
    <MuiAvatar
      ref={ref}
      src={src}
      alt={alt}
      {...props}
    >
      {children}
    </MuiAvatar>
  )
);

Avatar.displayName = 'Avatar';

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt, ...props }, ref) => (
    <img ref={ref} src={src} alt={alt} {...props} />
  )
);

AvatarImage.displayName = 'AvatarImage';

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
);

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
