import '@mui/material/styles'

interface FontOptions {
  bold?: string
  normal?: string
}

declare module '@mui/material/styles' {
  interface Theme {
    applyLinkStyles?: any
    palette?: any
    typography?: any
    breakpoints?: any
    font?: FontOptions
    shape?: any
    spacing?: any
    direction?: any
    shadows?: any
    customShadows?: any
  }
  interface ThemeOptions {
    applyLinkStyles?: any
    palette?: any
    typography?: any
    breakpoints?: any
    font?: FontOptions
    shape?: any
    spacing?: any
    direction?: any
    shadows?: any
    customShadows?: any
  }
}
