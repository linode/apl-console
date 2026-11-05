import { Theme } from '@mui/material/styles'
//
//
import { InputSelectIcon } from './CustomIcons'

// ----------------------------------------------------------------------

export default function Select(theme: Theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: InputSelectIcon,
      },
      styleOverrides: {
        icon: {
          color: theme.palette.text.secondary,
        },
        select: {
          minHeight: '1.25rem',
          '&:focus': {
            borderRadius: 0,
          },
        },
      },
    },
  }
}
