import { createTheme, Theme, ThemeOptions } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'

export const c = {
  light: '#ccc',
  dark: '#666',
  grey: '#CFD8DC',
  blueSoft: '#A4D2FF',
  blueLight: '#67B3FF',
  blueMain: '#1976D2',
  blueDark: '#0D47A1',
  redSoft: '#ffbbae',
  redLight: '#ff7359',
  redMain: '#ca2000',
  redDark: '#a11900',
  yellowSoft: '#ece7e2',
  yellowLight: '#ffd700',
  yellowMain: '#f1c400',
  yellowDark: '#dab100',
  brownSoft: '#ece7e2',
  brownLight: '#cb9a6a',
  brownMain: '#cd853f',
  brownDark: '#96612d',
  greenSoft: '#bae169',
  greenLight: '#9acd32',
  greenMain: '#00b400',
  greenDark: '#228b22',
}

export const commonDark = {
  black: c.dark,
  white: c.light,
}

export const teamColors = {
  background: c.blueDark,
  paper: c.yellowSoft,
  primary: {
    light: c.blueLight,
    main: c.blueMain,
    dark: c.blueDark,
  },
  secondary: {
    light: c.yellowLight,
    main: c.yellowMain,
    dark: c.yellowDark,
  },
}

export const adminColors = {
  background: c.redDark,
  paper: c.brownSoft,
  primary: {
    light: c.redLight,
    main: c.redMain,
    dark: c.redDark,
  },
  secondary: {
    light: c.yellowLight,
    main: c.yellowMain,
    dark: c.yellowDark,
  },
}

const getOverrides = (c: any): ThemeOptions => ({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      // '"Comfortaa"',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'primary',
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          borderRadius: '2em',
        },
        iconSizeSmall: {
          marginRight: '3px',
        },
        textSecondary: ({ theme }) => ({
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.MuiFormControl-root:has(> input)': {
          display: 'none',
        },
        body: {
          fontSize: '0.875rem',
        },
        // h5: {
        //   fontSize: '1.2rem',
        //   fontWeight: 'bold',
        // },
        'h5:first-letter,h6:first-letter,h7:first-letter': {
          textTransform: 'capitalize',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: 8,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          minWidth: '10rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        multiline: {
          minWidth: '30rem',
        },
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '38px',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          marginBottom: 0,
          marginTop: 0,
          paddingBottom: 4,
          paddingTop: 4,
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        // color: 'primary',
      },
    },
    MuiSwitch: {
      defaultProps: {
        // color: 'primary',
      },
    },
    MuiTab: {
      styleOverrides: {
        textColorSecondary: ({ theme }) => ({
          color: theme.palette.common.white,
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        caption: {
          maxWidth: 'fit-content',
          paddingBottom: 16,
        },
      },
    },
  },
  palette: {
    background: {
      default: c.background,
      paper: c.paper,
    },
    primary: c.primary,
    secondary: c.secondary,
  },
})

let name = 'admin'
let mode = 'light'

export const setThemeName = (inName: string): void => {
  name = inName
}

export const getThemeMode = (): string => mode
export const setThemeMode = (inMode: string): void => {
  mode = inMode
}

export const toggleThemeMode = (): string => {
  mode = mode === 'light' ? 'dark' : 'light'
  return mode
}

const teamOverrides = getOverrides(teamColors)
const teamLight = createTheme(teamOverrides)
const teamDark = createTheme({
  ...teamOverrides,
  palette: {
    mode: 'dark',
    common: commonDark,
    text: {
      primary: c.light,
    },
    primary: {
      // contrastText: c.blueSoft,
      main: c.blueDark,
    },
    secondary: {
      main: c.blueMain,
    },
  },
})
const adminOverrides = getOverrides(adminColors)
const adminLight = createTheme(adminOverrides)
const adminDark = createTheme({
  ...adminOverrides,
  palette: {
    mode: 'dark',
    common: commonDark,
    text: {
      primary: c.light,
    },
    primary: {
      // contrastText: c.redSoft,
      main: c.redDark,
    },
    secondary: {
      main: c.redMain,
    },
  },
})

export const themes = {
  team: {
    light: teamLight,
    dark: teamDark,
  },
  admin: {
    light: adminLight,
    dark: adminDark,
  },
}

export const getTheme = (): Theme => themes[name][mode]

export const useMainStyles = makeStyles()((theme) => ({
  headerlink: {
    // color: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    '&&': {
      textDecoration: 'none',
      color: mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.secondary.main,
    },
    '&&:hover': {
      color: mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.secondary.main,
    },
    '&&.Mui-selected': {
      color: mode === 'dark' ? theme.palette.secondary.contrastText : theme.palette.secondary.light,
    },
  },
  selectable: {
    // color: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&&': {
      textDecoration: 'none',
      color: mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    },
    '&&:hover': {
      color: mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    },
    '&&.Mui-selected': {
      color: mode === 'dark' ? theme.palette.secondary.light : theme.palette.primary.dark,
    },
  },
}))
