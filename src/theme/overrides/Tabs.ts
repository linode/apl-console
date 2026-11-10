import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Tabs(theme: Theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        indicator: {
          backgroundColor: theme.palette.cm.linkActiveLight,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
          minHeight: 40,
          padding: theme.spacing(1, 1.5),
          fontWeight: 400,
          textTransform: 'none',
          borderRadius: 0,
          color: theme.palette.text.secondary,
          '&.Mui-selected:not(.Mui-disabled)': {
            color: theme.palette.cm.linkActiveLight,
            fontWeight: 700,
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
          },
          '&.Mui-focusVisible': {
            outline: `2px solid ${theme.palette.cm.linkActiveLight}`,
            outlineOffset: -2,
          },
          '@media (min-width: 600px)': {
            minWidth: 48,
          },
        },
        labelIcon: {
          minHeight: 40,
          flexDirection: 'row',
          '& > *:first-of-type': {
            marginBottom: 0,
            marginRight: theme.spacing(1),
          },
        },
        wrapper: {
          flexDirection: 'row',
          whiteSpace: 'nowrap',
        },
        textColorInherit: {
          opacity: 1,
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          width: 48,
          borderRadius: 0,
        },
      },
    },
  }
}
