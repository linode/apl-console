import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Menu(theme: Theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          padding: theme.spacing(0.75, 1.5),
          '&:hover': {
            backgroundColor: theme.palette.cm.rowAlter,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
  }
}
