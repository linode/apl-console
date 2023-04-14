import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Link(_: Theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
  }
}
