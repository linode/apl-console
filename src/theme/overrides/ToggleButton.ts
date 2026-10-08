import { Theme, alpha } from '@mui/material/styles'
//
import { ColorSchema } from '../palette'

// ----------------------------------------------------------------------

export default function ToggleButton(theme: Theme) {
  const style = (color: ColorSchema) => ({
    props: { color },
    style: {
      '&:hover': {
        borderColor: alpha(theme.palette[color].main, 0.48),
        backgroundColor: alpha(theme.palette[color].main, theme.palette.action.hoverOpacity),
      },
      '&.Mui-selected': {
        borderColor: alpha(theme.palette[color].main, 0.48),
      },
    },
  })

  return {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          padding: theme.spacing(1, 1.5),
        },
      },
      variants: [
        {
          props: { color: 'standard' },
          style: {
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
            },
          },
        },
        style('primary'),
        style('secondary'),
        style('info'),
        style('success'),
        style('warning'),
        style('error'),
      ],
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
  }
}
