import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Paper(theme: Theme) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      variants: [
        {
          props: { variant: 'outlined' },
          style: { borderColor: theme.palette.divider },
        },
      ],

      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
  }
}
