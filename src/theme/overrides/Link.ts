import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Link(theme: Theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: ({ ownerState }: { ownerState: { color?: string } }) => ({
          ...(ownerState.color === 'primary' && {
            color: theme.palette.cm.linkActiveLight,
            '&:hover:not([aria-disabled="true"])': {
              color: theme.palette.cm.buttonPrimaryHover,
            },
          }),
          '&[aria-disabled="true"]': {
            color: theme.palette.text.disabled,
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.cm.linkActiveLight}`,
            outlineOffset: 2,
          },
        }),
      },
    },
  }
}
