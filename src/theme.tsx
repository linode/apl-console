import { createMuiTheme, createStyles, makeStyles, Theme, ThemeOptions } from '@material-ui/core/styles'

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
    props: {
      MuiLink: {
        underline: 'none',
      },
      MuiCheckbox: {
        color: 'primary',
      },
      MuiSwitch: {
        color: 'primary',
      },
      MuiRadio: {
        color: 'primary',
      },
    },
    overrides: {
      MuiCssBaseline: {},
      MuiButton: {
        label: {
          color: 'primary',
        },
        root: {
          borderRadius: '2em',
        },
      },
      MuiInputBase: {
        root: {
          borderRadius: '6px',
        },
      },
      MuiFormLabel: {
        root: {
          textTransform: 'capitalize',
        },
      },

      MuiListItemIcon: {
        root: {
          minWidth: '38px',
        },
      },
      MuiListItem: {
        root: {},
      },
      MuiListItemText: {
        root: {
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
      MuiTableHead: {
        root: {},
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
let type = 'light'

export function setThemeName(inName: string): void {
  name = inName
}

export function getThemeType(): string {
  return type
}
export function setThemeType(inType: string): void {
  type = inType
}

export const toggleThemeType = (): string => {
  type = type === 'light' ? 'dark' : 'light'
  return type
}

const teamOverrides = getOverrides(teamColors)
const teamLight = createMuiTheme(teamOverrides)
const teamDark = createMuiTheme({
  ...teamOverrides,
  palette: {
    type: 'dark',
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
const adminLight = createMuiTheme(adminOverrides)
const adminDark = createMuiTheme({
  ...adminOverrides,
  palette: {
    type: 'dark',
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

export function getTheme(): Theme {
  return themes[name][type]
}

export const createClasses = (stylesObj): any => makeStyles(() => createStyles(stylesObj))({})

export const mainStyles = makeStyles((theme) => ({
  forms: {
    '@global': {
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
      '.MuiButton-textSecondary': {
        color: theme.palette.primary,
      },
      '.MuiTypography-root': {
        // maxWidth: '300px',
      },
      h5: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      },
    },
  },
  // button: {
  //   color: theme.palette.common.white,
  //   backgroundColor: theme.palette.primary.main,
  // },
  headerlink: {
    // color: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    '&&': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.secondary.contrastText : theme.palette.secondary.main,
    },
    '&&:hover': {
      color: type === 'dark' ? theme.palette.secondary.contrastText : theme.palette.secondary.main,
    },
    '&&.Mui-selected': {
      color: type === 'dark' ? theme.palette.secondary.contrastText : theme.palette.secondary.light,
    },
  },
  selectable: {
    // color: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&&': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    },
    '&&:hover': {
      color: type === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    },
    '&&.Mui-selected': {
      color: type === 'dark' ? theme.palette.secondary.light : theme.palette.primary.dark,
    },
  },
}))
