import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Typography(theme: Theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
        body1: {
          ...theme.typography.body1,
        },
        caption: {
          ...theme.typography.caption,
        },
        h1: {
          ...theme.typography.h1,
        },
        h2: {
          ...theme.typography.h2,
        },
        h3: {
          ...theme.typography.h3,
        },
        h6: {
          ...theme.typography.h6,
        },
        subtitle1: {
          ...theme.typography.subtitle1,
        },
      },
    },
  }
}
