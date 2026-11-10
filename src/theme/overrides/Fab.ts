import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Fab(theme: Theme) {
  return {
    MuiFab: {
      defaultProps: {
        color: 'primary',
      },

      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: theme.palette.grey[400],
          },
          '&:active': {
            boxShadow: 'none',
          },
          '&.Mui-focusVisible': {
            boxShadow: 'none',
            outline: `2px solid ${theme.palette.cm.linkActiveLight}`,
            outlineOffset: 2,
          },
        },
        primary: {
          '&:hover': {
            backgroundColor: theme.palette.cm.buttonPrimaryHover,
          },
        },
        secondary: {
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
        },
        extended: {
          padding: theme.spacing(1, 1.5),
          borderRadius: 1,
          '& svg': {
            marginRight: theme.spacing(1),
          },
        },
      },
    },
  }
}
