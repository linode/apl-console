import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Backdrop(theme: Theme) {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: [`rgba(0, 0, 0, 0.5)`],
          '&.MuiBackdrop-invisible': {
            background: 'transparent',
          },
        },
      },
    },
  }
}
