import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function DataGrid(theme: Theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid transparent`,
          '& .MuiTablePagination-root': {
            borderTop: 0,
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.cm.rowAlter,
            '& .MuiButton-root': {
              marginRight: theme.spacing(1.5),
              '&:not(.Mui-disabled)': {
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            },
          },
          '& .MuiDataGrid-cell, .MuiDataGrid-columnsContainer': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-columnSeparator': {
            color: theme.palette.divider,
          },
          '& .MuiDataGrid-columnHeader[data-field="__check__"]': {
            padding: 0,
          },
        },
      },
    },
    MuiGridMenu: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-gridMenuList': {
            boxShadow: theme.shadows[3],
            borderRadius: 0,
          },
          '& .MuiMenuItem-root': {
            ...theme.typography.body2,
          },
        },
      },
    },
    MuiGridFilterForm: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.5, 0),
          '& .MuiFormControl-root': {
            margin: theme.spacing(0, 0.5),
          },
          '& .MuiInput-root': {
            marginTop: theme.spacing(3),
            '&::before, &::after': {
              display: 'none',
            },
            '& .MuiNativeSelect-select, .MuiInput-input': {
              ...theme.typography.body2,
              padding: theme.spacing(0.75, 1),
              borderRadius: 0,
              backgroundColor: theme.palette.cm.textBox,
              border: `1px solid ${theme.palette.cm.textBoxBorder}`,
              '&:focus': {
                outline: `2px solid ${theme.palette.cm.linkActiveLight}`,
                outlineOffset: -1,
              },
              '&.Mui-disabled': {
                color: theme.palette.text.disabled,
                backgroundColor: theme.palette.action.disabledBackground,
                borderColor: theme.palette.action.disabled,
              },
            },
            '&.Mui-error:not(.Mui-disabled) .MuiNativeSelect-select, &.Mui-error:not(.Mui-disabled) .MuiInput-input': {
              borderColor: theme.palette.error.main,
              '&:focus': {
                outlineColor: theme.palette.error.main,
              },
            },
            '& .MuiSvgIcon-root': {
              right: 4,
            },
          },
        },
      },
    },
    MuiGridPanelFooter: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
          justifyContent: 'flex-end',
          '& .MuiButton-root': {
            '&:first-of-type': {
              marginRight: theme.spacing(1.5),
            },
            '&:first-of-type:not(.Mui-disabled)': {
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
            '&:last-of-type:not(.Mui-disabled)': {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.cm.buttonPrimaryHover,
              },
            },
          },
        },
      },
    },
  }
}
