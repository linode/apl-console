import { createTheme, createStyles, Theme, ThemeOptions } from '@mui/material/styles'
import { createMakeStyles } from 'tss-react'

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

const getOverrides = (c: any): ThemeOptions => {
  return {
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
      MuiLink: {
        defaultProps: {
          underline: 'none',
        },
      },
      MuiCheckbox: {
        defaultProps: {
          color: 'primary',
        },
      },
      MuiSwitch: {
        defaultProps: {
          color: 'primary',
        },
      },
      MuiRadio: {
        defaultProps: {
          color: 'primary',
        },
      },
      MuiButton: {
        styleOverrides: {
          // label: {
          //   color: 'primary',
          // },
          root: {
            borderRadius: '2em',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
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
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 4,
            paddingBottom: 4,
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
  }
}

let name = 'admin'
let mode = 'light'

export const setThemeName = (inName: string): void => {
  name = inName
}

export const getThemeMode = (): string => {
  return mode
}
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

export const getTheme = (): Theme => {
  return themes[name][mode]
}

export const {
  makeStyles,
  useStyles, // <- To use when you need css or cx but don't have custom classes
} = createMakeStyles({ useTheme: getTheme })

export const createClasses = (stylesObj): any => makeStyles()(() => createStyles(stylesObj))

export const useMainStyles = makeStyles()((theme: Theme) => ({
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

export const globalStyles = (theme: Theme): any => ({
  '.MuiInput-root:not([data-cy="select-oboteam"],[data-cy="select-cluster"])': {
    minWidth: '10rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  '.MuiInput-root.MuiInputBase-multiline': {
    minWidth: '30rem',
  },
  '.MuiFormControl-root:has(> input)': {
    display: 'none',
  },
  '.MuiFormControl-root': {
    marginTop: 8,
  },
  '.MuiButton-iconSizeSmall': {
    marginRight: '3px',
  },
  '.MuiButton-textSecondary': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  '.MuiTypography-root': {
    // maxWidth: '300px',
  },
  '.MuiTypography-caption': {
    maxWidth: 'fit-content',
  },
  h5: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  'h5:first-letter,h6:first-letter,h7:first-letter': {
    textTransform: 'capitalize',
  },
})
