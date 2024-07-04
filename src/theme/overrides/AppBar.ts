import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function AppBar(theme: Theme) {
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: `${theme.palette.background.default} 0px -1px 0px inset`,
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: '0 !important',
        },
      },
    },
  }
}
