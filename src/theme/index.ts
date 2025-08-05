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
    fontFamily: '"YS Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
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