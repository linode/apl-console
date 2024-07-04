import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function FormControl(theme: Theme) {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: '10px',
        },
      },
    },
  }
}
