import { createMuiTheme, createStyles, makeStyles, ThemeOptions } from '@material-ui/core/styles'
import bg from './images/yellowBg.jpg'

export const colors = {
  dark: {
    accent: '#f7be16', // yellow
  },
  light: {
    accent: '#f7be16', // yellow
  },
}

const mainOverrides: ThemeOptions = {
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          // background: `linear-gradient(to bottom,rgba(255, 191, 0, 0.5) 50%,rgba(255, 191, 0, 0) 65%) no-repeat bottom center fixed, url(${bg}) no-repeat bottom right fixed`,
          // background: `linear-gradient(to bottom,rgba(255, 191, 0, 0.5) 50%,rgba(255, 191, 0, 0) 65%) no-repeat bottom center fixed`,
          backgroundColor: 'rgba(255, 191, 0, 1)',
          backgroundSize: 'cover',
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: '2em',
      },
    },
    MuiInputBase: {
      root: {
        borderRadius: '6px',
        color: 'secondary',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: '38px',
      },
    },
  },
  palette: {
    text: {
      primary: '#555',
      secondary: '#aaa',
    },
    background: {
      default: colors.light.accent,
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
}
// tslint:disable-next-line: one-variable-per-declaration
const teamOverrides: ThemeOptions = {
  ...mainOverrides,
  palette: {
    ...mainOverrides.palette,
    primary: {
      main: '#0053ff',
    },
    secondary: {
      main: '#555',
    },
  },
}
const adminOverrides: ThemeOptions = {
  ...mainOverrides,
  palette: {
    ...mainOverrides.palette,
    primary: {
      main: '#ff7e00',
    },
    secondary: {
      main: '#555',
    },
  },
}

export const theme = createMuiTheme(teamOverrides)

export const adminTheme = createMuiTheme(adminOverrides)

export const createClasses = (stylesObj: object): any => makeStyles(() => createStyles(stylesObj))({})
