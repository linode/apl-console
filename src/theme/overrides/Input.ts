import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          ...theme.typography.body1,
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          '&:not(.MuiInputBase-multiline)': {
            minHeight: 34,
          },
          '&.Mui-focused.Mui-error:not(.Mui-disabled)': {
            outline: `2px solid ${theme.palette.error.main}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
          },
        },
        input: {
          '&:not(.MuiInputBase-inputMultiline):not(.MuiSelect-multiple):not(.MuiNativeSelect-multiple)': {
            height: '1.25rem',
          },
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.secondary,
          },
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette.cm.textBox} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
            caretColor: theme.palette.text.primary,
          },
          '&.Mui-disabled:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette.cm.disabledBackground} inset`,
            WebkitTextFillColor: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.cm.textBox,
          '&.MuiInputBase-multiline': {
            padding: theme.spacing(0.875, 0),
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.cm.disabledBackground,
          },
        },
        input: {
          padding: theme.spacing(0.875, 0),
          '&.MuiInputBase-inputMultiline': {
            padding: 0,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.cm.textBoxBorder,
          },
          '&:hover:not(.Mui-disabled):not(.Mui-error):before': {
            borderBottomColor: theme.palette.primary.main,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: theme.palette.cm.textBox,
          '&:hover': {
            backgroundColor: theme.palette.cm.textBox,
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.cm.textBox,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.cm.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.cm.textBoxBorder,
          },
        },
        input: {
          '&.MuiInputBase-inputHiddenLabel:not(.MuiInputBase-inputMultiline)': {
            paddingTop: 7,
            paddingBottom: 7,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: theme.palette.cm.textBox,
          '&.MuiInputBase-multiline': {
            padding: theme.spacing(0.875, 1.5),
          },
          '&.MuiInputBase-adornedStart': {
            paddingLeft: 12,
          },
          '&.MuiInputBase-adornedEnd': {
            paddingRight: 12,
          },
          '&:hover:not(.Mui-focused):not(.Mui-error):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.cm.disabledBackground,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.cm.disabledBorder,
            },
          },
        },
        notchedOutline: {
          borderColor: theme.palette.cm.textBoxBorder,
        },
        input: {
          padding: theme.spacing(0.875, 1.5),
          '&.MuiInputBase-inputMultiline': {
            padding: 0,
          },
          '&.MuiInputBase-inputAdornedStart': {
            paddingLeft: 0,
          },
          '&.MuiInputBase-inputAdornedEnd': {
            paddingRight: 0,
          },
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${theme.palette.cm.textBox} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
            caretColor: theme.palette.text.primary,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&:not(.MuiInputLabel-shrink)': {
            transform: 'translate(12px, 7px) scale(1)',
          },
        },
        standard: {
          '&.MuiInputLabel-formControl:not(.MuiInputLabel-shrink)': {
            transform: 'translate(0, 23px) scale(1)',
          },
        },
      },
    },
  }
}
