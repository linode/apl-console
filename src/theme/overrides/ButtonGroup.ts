import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function ButtonGroup(theme: Theme) {
  return {
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
      },
      variants: [
        {
          props: { disabled: true },
          style: {
            boxShadow: 'none',
            '& .MuiButtonGroup-grouped.Mui-disabled': {
              color: theme.palette.action.disabled,
              borderColor: `${theme.palette.action.disabledBackground} !important`,
              '&.MuiButton-contained': {
                backgroundColor: theme.palette.action.disabledBackground,
              },
            },
          },
        },
      ],

      styleOverrides: {
        root: {
          borderRadius: 1,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  }
}
