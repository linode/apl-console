import { createMuiTheme, createStyles, makeStyles, ThemeOptions, Theme } from '@material-ui/core/styles'

export const c = {
  light: '#ccc',
  dark: '#666',
  blueSoft: '#A4D2FF',
  blueLight: '#67B3FF',
  blueMain: '#0064C8',
  blueDark: '#2F45AB',
  redSoft: '#ffbbae',
  redLight: '#ff7359',
  redMain: '#ca2000',
  redDark: '#a11900',
  yellowSoft: '#ffe6a7',
  yellowLight: '#ffd700',
  yellowMain: '#f1c400',
  yellowDark: '#dab100',
  brownSoft: '#e6c19c',
  brownLight: '#cb9a6a',
  brownMain: '#cd853f',
  brownDark: '#96612d',
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
    // light: c.blueLight,
    main: c.blueMain,
    // dark: c.blueDark,
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
    // light: c.redSoft,
    main: c.redMain,
    // dark: c.redMain,
  },
}

const getOverrides = (c: any): ThemeOptions => {
  return {
    overrides: {
      MuiCssBaseline: {
        // '@global': {
        //   body: {
        //     backgroundSize: 'cover',
        //   },
        // },
      },
      MuiButton: {
        root: {
          borderRadius: '2em',
        },
      },
      MuiInputBase: {
        root: {
          borderRadius: '6px',
          // color: 'secondary',
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: '38px',
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
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  }
}

let name: string
let type: string

export function setThemeName(inName: string): void {
  name = inName
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

export const mainStyles = makeStyles(theme => ({
  selectable: {
    color: theme.palette.primary.main,
    '&': {
      textDecoration: 'none',
      color: theme.palette.primary[type === 'dark' ? 'contrastText' : 'dark'],
    },
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.primary[type === 'dark' ? 'light' : 'light'],
    },
    '@global': {
      a: {
        textDecoration: 'none',
        color: theme.palette.primary[type === 'dark' ? 'contrastText' : 'dark'],
      },
      'a:hover': {
        textDecoration: 'none',
        color: theme.palette.primary[type === 'dark' ? 'light' : 'light'],
      },
    },
  },
}))
