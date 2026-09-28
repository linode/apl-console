import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.shadows[3],
          borderRadius: 0,
        },
        listbox: {
          padding: theme.spacing(0.5, 0),
          '& .MuiAutocomplete-option': {
            ...theme.typography.body2,
            padding: theme.spacing(0.75, 1.5),
            margin: 0,
            borderRadius: 0,
          },
        },
        inputRoot: {
          '&.MuiOutlinedInput-root': {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 12,
            '& .MuiAutocomplete-input': {
              padding: theme.spacing(0.875, 0),
            },
          },
          '&.MuiInput-root': {
            paddingTop: 0,
            paddingBottom: 0,
            '& .MuiAutocomplete-input': {
              padding: theme.spacing(0.875, 0),
            },
          },
        },
      },
    },
  }
}
