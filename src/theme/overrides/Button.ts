import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          ...theme.typography.button,
          fontSize: '0.875rem',
          lineHeight: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          padding: theme.spacing(1, 1.5),
          borderRadius: 1,
          boxShadow: 'none',
          '&:hover, &:active': {
            boxShadow: 'none',
          },
          '&.Mui-focusVisible, &:focus-visible': {
            boxShadow: 'none',
            outline: `2px solid ${theme.palette.cm.linkActiveLight}`,
            outlineOffset: 2,
          },
          '&[aria-disabled="true"]': {
            color: theme.palette.action.disabled,
          },
        },
        // contained
        containedInherit: {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.neutral,
          '&:hover:not(.Mui-disabled):not([aria-disabled="true"])': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        contained: {
          border: '1px solid transparent',
          '&[aria-disabled="true"]': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        containedPrimary: {
          '&:hover:not(.Mui-disabled):not([aria-disabled="true"])': {
            backgroundColor: theme.palette.cm.buttonPrimaryHover,
          },
        },
        // outlined
        outlinedInherit: {
          borderColor: theme.palette.divider,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        outlinedPrimary: {
          '&:hover:not(.Mui-disabled):not([aria-disabled="true"])': {
            color: theme.palette.cm.buttonPrimaryHover,
            borderColor: theme.palette.cm.buttonPrimaryHover,
          },
        },
        textPrimary: {
          color: theme.palette.cm.linkActiveLight,
          '&:hover:not(.Mui-disabled):not([aria-disabled="true"])': {
            color: theme.palette.cm.buttonPrimaryHover,
          },
        },
        text: {
          border: '1px solid transparent',
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  }
}
