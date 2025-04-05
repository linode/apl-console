import { Theme } from '@mui/material/styles'
import font from 'theme/font'

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
          color: theme.palette.cm.primaryText,
          fontSize: '0.875rem',
          lineHeight: '1.125rem',
        },
        caption: {
          color: theme.palette.cm.primaryText,
          fontSize: '0.625rem',
          lineHeight: '0.625rem',
        },
        fontFamily: font,
        fontSize: 16,
        h1: {
          // [breakpoints.up('lg')]: {
          //   fontSize: '1.5rem',
          //   lineHeight: '1.875rem',
          // },
          color: theme.palette.cm.headline,
          fontFamily: font.bold,
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
        },
        h2: {
          color: theme.palette.cm.headline,
          fontFamily: font.bold,
          fontSize: '1.125rem',
          lineHeight: '1.5rem',
        },
        h3: {
          color: theme.palette.cm.headline,
          fontFamily: font.bold,
          fontSize: '1rem',
          lineHeight: '1.4rem',
        },
        h6: {
          color: theme.palette.cl.text.title,
          fontFamily: font.bold,
          fontWeight: 700,
          fontSize: '1rem',
          lineHeight: '1.125rem',
        },
        subtitle1: {
          color: theme.palette.cm.primaryText,
          fontSize: '1.075rem',
          lineHeight: '1.5rem',
        },
      },
    },
  }
}
