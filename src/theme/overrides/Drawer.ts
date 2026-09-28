import { Theme } from '@mui/material'

// ----------------------------------------------------------------------

export default function Drawer(theme: Theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        modal: {
          '&[role="presentation"]': {
            '& .MuiDrawer-paperAnchorLeft, & .MuiDrawer-paperAnchorRight': {
              boxShadow: theme.shadows[6],
            },
          },
        },
      },
    },
  }
}
