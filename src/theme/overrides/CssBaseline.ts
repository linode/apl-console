import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function CssBaseline(theme: Theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
          colorScheme: theme.palette.mode,
        },
        '#root, #__next': {
          width: '100%',
          minHeight: '100%',
        },
        'a:where([href]):not(:where(.MuiButtonBase-root, .MuiLink-root))': {
          color: theme.palette.cm.linkActiveLight,
          textDecoration: 'none',
          '&:hover:not([aria-disabled="true"])': {
            color: theme.palette.cm.buttonPrimaryHover,
            textDecoration: 'underline',
          },
          '&[aria-disabled="true"]': {
            color: theme.palette.text.disabled,
          },
        },
        'a[href]:focus-visible, .MuiButtonBase-root.Mui-focusVisible': {
          outline: `2px solid ${theme.palette.cm.linkActiveLight}`,
          outlineOffset: 2,
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
      },
    },
  }
}
