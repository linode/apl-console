import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Table(theme: Theme) {
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: theme.palette.cm.rowAlter,
          },
          '&.MuiTableRow-hover:hover:not(.disabled-row):not([aria-disabled="true"])': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover:not(.disabled-row):not([aria-disabled="true"])': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          '&.MuiTableRow-head, &.MuiTableRow-footer': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
          height: 40,
          padding: theme.spacing(0, 1.5),
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
        },
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.neutral,
          fontWeight: 700,
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `solid 1px ${theme.palette.divider}`,
        },
        toolbar: {
          minHeight: 40,
          '@media (min-width: 600px)': {
            minHeight: 40,
          },
        },
        select: {
          '&:focus': {
            borderRadius: 0,
          },
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: -4,
        },
      },
    },
  }
}
