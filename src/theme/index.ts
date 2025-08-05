import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#FFDD2D', // Yandex yellow
      dark: '#E6C429',
      light: '#FFED5C',
      contrastText: '#000000',
    },
    secondary: {
      main: '#2196F3', // Blue accent
      dark: '#1976D2',
      light: '#64B5F6',
    },
    background: {
      default: '#F5F5F7', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C1E',
      secondary: '#8E8E93',
    },
    divider: '#E5E5EA',
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    // Page titles and main headings
    h1: {
      fontSize: '2rem', // 32px
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    // Section titles
    h2: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    // Card titles
    h3: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    // Subsection headings
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    // Component titles
    h5: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // Small headings
    h6: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // Main body text
    body1: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    // Secondary text
    body2: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    // Button text
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'none',
    },
    // Small labels and captions
    caption: {
      fontSize: '0.6875rem', // 11px
      fontWeight: 400,
      lineHeight: 1.4,
    },
    // Form labels
    subtitle1: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.5,
    },
    // Small form labels
    subtitle2: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#FFDD2D',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#E6C429',
          },
        },
        outlined: {
          borderColor: '#E5E5EA',
          color: '#1C1C1E',
          '&:hover': {
            backgroundColor: '#F5F5F7',
            borderColor: '#D1D1D6',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E5EA',
          boxShadow: 'none',
          '&:hover': {
            border: '1px solid #D1D1D6',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          height: 24,
        },
        colorSuccess: {
          backgroundColor: '#34C759',
          color: '#FFFFFF',
        },
        colorWarning: {
          backgroundColor: '#FF9500',
          color: '#FFFFFF',
        },
        colorError: {
          backgroundColor: '#FF3B30',
          color: '#FFFFFF',
        },
        colorInfo: {
          backgroundColor: '#007AFF',
          color: '#FFFFFF',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E5E5EA',
          fontSize: '0.875rem',
          padding: '12px 16px',
        },
        head: {
          backgroundColor: '#F5F5F7',
          fontWeight: 500,
          color: '#8E8E93',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E5E5EA',
            },
            '&:hover fieldset': {
              borderColor: '#D1D1D6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFDD2D',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease-in-out',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation4: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#E5E5EA',
        },
        bar: {
          borderRadius: 4,
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#F5F5F7',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
};

// Dark theme for sidebar
const darkThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'dark',
    background: {
      default: '#1C1C1E',
      paper: '#2C2C2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
    },
    divider: '#38383A',
  },
};

export const lightTheme = createTheme(baseThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

// Status colors for campaigns
export const statusColors = {
  draft: '#8E8E93',
  active: '#34C759',
  paused: '#FF9500',
  completed: '#007AFF',
} as const;