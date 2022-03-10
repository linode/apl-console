import { PaletteMode } from '@mui/material'
import { createTheme, Palette, PaletteOptions, Theme, ThemeOptions } from '@mui/material/styles'
import { cloneDeep } from 'lodash'
import { makeStyles } from 'tss-react/mui'

export const c = {
  black: '#111',
  white: '#eee',
  backgroundDark: '#121212',
  paperDark: '#282828',
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

export const textLight = {
  primary: '#333',
  secondary: '#777',
  disabled: '#ccc',
}

export const textDark = {
  primary: '#ddd',
  secondary: '#bbb',
  disabled: '#555',
}

const commonPalette = {
  mode: 'light' as PaletteMode,
  common: {
    black: c.black,
    white: c.white,
  },
  primary: {
    contrastText: c.white,
  },
  text: textLight,
}

const commonPaletteDark: PaletteOptions = {
  mode: 'dark' as PaletteMode,
  background: {
    default: c.backgroundDark,
    paper: c.paperDark,
  },
  action: {
    disabledBackground: c.backgroundDark,
  },
  text: textDark,
}

export const teamPalette: PaletteOptions = {
  ...cloneDeep(commonPalette),
  background: {
    default: c.blueDark,
    paper: c.yellowSoft,
  },
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

export const adminPalette: PaletteOptions = {
  ...cloneDeep(commonPalette),
  background: {
    default: c.redDark,
    paper: c.brownSoft,
  },
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

const getOverrides = (palette: PaletteOptions): ThemeOptions => {
  const p = palette as Palette
  const menuItemColor = p.text.secondary
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
          a: {
            color: p.primary.main,
            textDecoration: 'none',
          },
          body: {
            fontSize: '0.875rem',
          },
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
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: menuItemColor,
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
        styleOverrides: {
          root: {
            color: p.mode === 'light' ? p.primary.main : p.primary.light,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: '38px',
            color: menuItemColor,
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
            // color: p.mode === 'light' ? p.text.primary : p.text.secondary,
          },
        },
      },
      MuiRadio: {
        defaultProps: {},
      },
      MuiSwitch: {
        defaultProps: {},
      },
      MuiTab: {
        styleOverrides: {
          textColorSecondary: {
            color: p.common.white,
          },
          root: {
            '&.Mui-disabled': { color: p.primary.light },
          },
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
    palette: p,
  }
}

let name = 'team'
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

const teamOverrides = getOverrides(cloneDeep(teamPalette))
const teamDarkOverrides = getOverrides({
  ...cloneDeep(teamPalette),
  ...cloneDeep(commonPaletteDark),
  primary: {
    // contrastText: c.blueSoft,
    main: c.blueDark,
  },
  secondary: {
    main: c.blueMain,
  },
})
const teamLight = createTheme(teamOverrides)
const teamDark = createTheme(teamDarkOverrides)

const adminOverrides = getOverrides(cloneDeep(adminPalette))
const adminDarkOverrides = getOverrides({
  ...cloneDeep(adminPalette),
  ...cloneDeep(commonPaletteDark),
  primary: {
    // contrastText: c.redSoft,
    main: c.redDark,
  },
  secondary: {
    main: c.redMain,
  },
})
const adminLight = createTheme(adminOverrides)
const adminDark = createTheme(adminDarkOverrides)

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

export const useMainStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
    headerlink: {
      // color: p.primary.main,
      color: p.common.white,
      fontWeight: 'bold',
      '&&': {
        textDecoration: 'none',
        color: p.mode === 'dark' ? p.secondary.contrastText : p.secondary.main,
      },
      '&&:hover': {
        color: p.mode === 'dark' ? p.secondary.contrastText : p.secondary.main,
      },
      '&&.Mui-selected': {
        color: p.mode === 'dark' ? p.secondary.contrastText : p.secondary.light,
      },
    },
    selectable: {
      // color: p.primary.main,
      color: p.common.white,
      '&&': {
        textDecoration: 'none',
        color: p.mode === 'dark' ? p.common.white : p.common.black,
      },
      '&&:hover': {
        color: p.mode === 'dark' ? p.primary.light : p.primary.main,
      },
      '&&.Mui-selected': {
        color: p.mode === 'dark' ? p.secondary.light : p.primary.dark,
      },
    },
  }
})
