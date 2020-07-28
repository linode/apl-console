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
    props: {
      MuiLink: {
        underline: 'none',
      },
    },
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
          // color: 'secondary',
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
        root: {
          // color: c.secondary.main,
          // backgroundColor: c.primary.main,
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
  forms: {
    '@global': {
      '.MuiCheckbox-colorSecondary.Mui-checked:not(.Mui-disabled), .MuiCheckbox-colorSecondary.Mui-checked input:not(disabled), .MuiButton-textSecondary': {
        color: theme.palette.primary.main,
      },
      '.MuiSwitch-colorSecondary.Mui-checked, .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
        color: theme.palette.primary.main,
      },
      '.MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
  button: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
  headerlink: {
    // color: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&': {
      textDecoration: 'none',
      color: theme.palette.common.white,
    },
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.primary.light,
    },
    '&.Mui-selected': {
      textDecoration: 'none',
      color: theme.palette.primary.dark,
    },
  },
  selectable: {
    // color: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    },
    '&:hover': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    },
    '&.Mui-selected': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.secondary.light : theme.palette.primary.dark,
    },
  },
  '@global .headerLink': {
    '.headerLink.a': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    },
    '.headerLink.a:hover': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    },
    '.headerLink.a:selected': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
  },
  '@global': {
    '.selectable.a': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    },
    '.selectable.a:hover': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    },
    '.selectable.a:selected': {
      textDecoration: 'none',
      color: type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
  },
}))
