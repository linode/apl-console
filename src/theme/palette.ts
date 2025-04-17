import { alpha } from '@mui/material/styles'

// ----------------------------------------------------------------------

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`
}

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'

interface GradientsPaletteOptions {
  primary: string
  cyan: string
  info: string
  success: string
  warning: string
  error: string
}

interface ChartPaletteOptions {
  violet: string[]
  blue: string[]
  green: string[]
  yellow: string[]
  red: string[]
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    paper: string
    default: string
    contrast: string
    contrastAlt: string
    sidebar: string
    neutral: string
  }
  interface SimplePaletteColorOptions {
    lighter: string
    darker: string
  }
  interface PaletteColor {
    lighter: string
    darker: string
  }
  interface Palette {
    gradients: GradientsPaletteOptions
    chart: ChartPaletteOptions
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions
    chart: ChartPaletteOptions
  }
}

declare module '@mui/material' {
  interface Color {
    0: string
    500_8: string
    500_12: string
    500_16: string
    500_24: string
    500_32: string
    500_48: string
    500_56: string
    500_80: string
  }
}

// SETUP COLORS
const PRIMARY = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249',
}
const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
}
const CYAN = {
  lighter: '#D1FFFC',
  light: '#76F2FF',
  main: '#59ADE1',
  dark: '#0E77B7',
  darker: '#053D7A',
}

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
}
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
}
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
}
const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
}

const GREY = {
  0: '#FFFFFF',
  50: '#f9fafa',
  100: '#F4F5F6',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  510: '#a3a3ab',
  520: '#515157',
  550: '#3d3d42',
  600: '#343438',
  700: '#33373e',
  800: '#222222',
  900: '#161C24',
  1000: '#000000',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
}
const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  cyan: createGradient(CYAN.light, CYAN.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
}

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
}

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  cyan: { ...CYAN, contrastText: GREY[800] },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
}

const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    cl: {
      text: {
        title: '#343438',
        subTitle: '#696970',
      },
      breadCrumb: {
        crumbPath: '#696970',
        lastCrumb: '#343438',
      },
    },
    divider: GREY[500_24],
    cm: {
      black: GREY[1000],
      blue: '#108ad6',
      bgmain: '#f7f7fa',
      buttonPrimaryHover: '#009cde',
      disabledText: 'rgba(0, 0, 0, 0.75)',
      disabledBackground: '#f4f4f4',
      disabledBorder: '#c2c2ca',
      grey1: GREY[510],
      grey4: '#83838c',
      grey6: '#d6d6dd',
      headline: '#343438',
      primaryText: '#696970',
      red: '#d63c42',
      rowAlter: '#f4f5f6',
      tableStatic: '#e5e5ea',
      textBox: '#fff',
      textBoxBorder: '#696970',
      linkActiveLight: '#0174bc',
      tagButtonBg: '#edf8ff',
      tagButtonText: '#343438',
      tagIcon: '#343438',
      yellow: '#f5f531',
      white: '#343438',
    },
    background: {
      paper: GREY[0],
      default: GREY[100],
      contrast: GREY[0],
      contrastAlt: GREY[50],
      header: GREY[0],
      sidebar: GREY[600],
      neutral: GREY[200],
    },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    mode: 'dark',
    text: { primary: '#fff', secondary: GREY[500], disabled: GREY[300] },
    cl: {
      text: {
        title: '#FFFFFF',
        subTitle: '#ABABAB',
      },
      breadCrumb: {
        crumbPath: '#E3E2E2',
        lastCrumb: '#FFFFFF',
      },
    },
    divider: GREY[520],
    cm: {
      black: GREY[0],
      blue: '#108ad6',
      bgmain: '#343438',
      buttonPrimaryHover: '#96cff0',
      disabledText: '#83838c',
      disabledBackground: '#515157',
      disabledBorder: '#515157',
      grey1: GREY[510],
      grey4: '#83838c',
      grey6: '#a3a3ab',
      headline: '#f7f7fa',
      primaryText: '#696970',
      red: '#d63c42',
      rowAlter: '#47474D',
      tableStatic: '#696970',
      textBox: '#343438',
      textBoxBorder: '#696970',
      linkActiveLight: '#5bb3ea',
      tagButtonBg: '#afdef8',
      tagButtonText: '#5bb3ea',
      tagIcon: '#5bb3ea',
      yellow: '#f5f531',
      white: '#ffffff',
    },
    background: {
      paper: GREY[550],
      default: GREY[600],
      contrast: GREY[550],
      contrastAlt: GREY[600],
      header: GREY[800],
      sidebar: GREY[800],
      neutral: GREY[500],
    },
    action: { active: GREY[500], ...COMMON.action },
  },
} as const

export default palette
