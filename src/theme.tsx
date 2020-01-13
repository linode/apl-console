import { createMuiTheme, createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import bg from './images/yellowBg.jpg'

export const colors = {
  accent: '#f7be16', // yellow
}

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: `linear-gradient(to bottom,rgba(255, 191, 0, 0.5) 50%,rgba(255, 191, 0, 0) 65%) no-repeat bottom center fixed, url(${bg}) no-repeat bottom right fixed`,
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
    primary: {
      main: '#00818a',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: colors.accent,
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
})

export const createClasses = (stylesObj: object): any => makeStyles(() => createStyles(stylesObj))({})
