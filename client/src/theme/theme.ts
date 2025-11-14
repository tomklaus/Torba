import { createTheme, ThemeOptions } from '@mui/material/styles';
import { CSSProperties } from '@mui/material/styles/createTypography';

declare module '@mui/material/styles' {
  interface Palette {
    status: {
      online: string;
      away: string;
      busy: string;
      offline: string;
    };
  }
  interface PaletteOptions {
    status?: {
      online?: string;
      away?: string;
      busy?: string;
      offline?: string;
    };
  }
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    } as CSSProperties,
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    } as CSSProperties,
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    } as CSSProperties,
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    } as CSSProperties,
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    } as CSSProperties,
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    } as CSSProperties,
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    } as CSSProperties,
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    } as CSSProperties,
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    } as CSSProperties,
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 4,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '6px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.16)',
          },
        },
      },
      defaultProps: {
        disableElevation: false,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&::before': {
            borderBottomWidth: '1px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(280, 65%, 48%)',
      light: 'hsl(280, 70%, 60%)',
      dark: 'hsl(280, 60%, 40%)',
      contrastText: 'hsl(280, 20%, 98%)',
    },
    secondary: {
      main: 'hsl(240, 4%, 86%)',
      light: 'hsl(240, 10%, 92%)',
      dark: 'hsl(240, 4%, 75%)',
      contrastText: 'hsl(240, 5%, 15%)',
    },
    error: {
      main: 'hsl(0, 72%, 45%)',
      light: 'hsl(0, 80%, 60%)',
      dark: 'hsl(0, 65%, 35%)',
      contrastText: 'hsl(0, 15%, 98%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)',
      light: 'hsl(38, 100%, 65%)',
      dark: 'hsl(38, 85%, 40%)',
      contrastText: 'hsl(0, 0%, 0%)',
    },
    info: {
      main: 'hsl(195, 100%, 50%)',
      light: 'hsl(195, 100%, 65%)',
      dark: 'hsl(195, 85%, 40%)',
      contrastText: 'hsl(0, 0%, 100%)',
    },
    success: {
      main: 'hsl(160, 84%, 40%)',
      light: 'hsl(160, 84%, 55%)',
      dark: 'hsl(160, 70%, 30%)',
      contrastText: 'hsl(0, 0%, 100%)',
    },
    background: {
      default: 'hsl(0, 0%, 98%)',
      paper: 'hsl(0, 0%, 100%)',
    },
    text: {
      primary: 'hsl(240, 5%, 12%)',
      secondary: 'hsl(240, 4%, 35%)',
      disabled: 'hsl(240, 4%, 65%)',
    },
    divider: 'hsl(240, 4%, 88%)',
    status: {
      online: 'rgb(34, 197, 94)',
      away: 'rgb(245, 158, 11)',
      busy: 'rgb(239, 68, 68)',
      offline: 'rgb(156, 163, 175)',
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(280, 65%, 55%)',
      light: 'hsl(280, 70%, 70%)',
      dark: 'hsl(280, 60%, 45%)',
      contrastText: 'hsl(280, 15%, 98%)',
    },
    secondary: {
      main: 'hsl(240, 5%, 18%)',
      light: 'hsl(240, 10%, 30%)',
      dark: 'hsl(240, 5%, 12%)',
      contrastText: 'hsl(240, 5%, 88%)',
    },
    error: {
      main: 'hsl(0, 72%, 52%)',
      light: 'hsl(0, 80%, 65%)',
      dark: 'hsl(0, 65%, 42%)',
      contrastText: 'hsl(0, 10%, 98%)',
    },
    warning: {
      main: 'hsl(38, 92%, 55%)',
      light: 'hsl(38, 100%, 70%)',
      dark: 'hsl(38, 85%, 45%)',
      contrastText: 'hsl(0, 0%, 0%)',
    },
    info: {
      main: 'hsl(195, 100%, 55%)',
      light: 'hsl(195, 100%, 70%)',
      dark: 'hsl(195, 85%, 45%)',
      contrastText: 'hsl(0, 0%, 0%)',
    },
    success: {
      main: 'hsl(160, 84%, 45%)',
      light: 'hsl(160, 84%, 60%)',
      dark: 'hsl(160, 70%, 35%)',
      contrastText: 'hsl(0, 0%, 0%)',
    },
    background: {
      default: 'hsl(240, 6%, 8%)',
      paper: 'hsl(240, 5%, 10%)',
    },
    text: {
      primary: 'hsl(240, 5%, 92%)',
      secondary: 'hsl(240, 5%, 68%)',
      disabled: 'hsl(240, 4%, 45%)',
    },
    divider: 'hsl(240, 5%, 16%)',
    status: {
      online: 'rgb(34, 197, 94)',
      away: 'rgb(245, 158, 11)',
      busy: 'rgb(239, 68, 68)',
      offline: 'rgb(156, 163, 175)',
    },
  },
});
