import { Theme } from '@mui/material/styles'

// ----------------------------------------------------------------------

export default function Input(theme: Theme) {
  return {
    MuiInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        disabled: {},
        error: {},
        focused: {},
        formControl: {
          'label + &': {
            marginTop: 0,
          },
        },
        input: {
          '&::placeholder': {
            color: '#a3a3ab',
          },
          boxSizing: 'border-box',
          // [breakpoints.only('xs')]: {
          //   fontSize: '1rem',
          // },
          fontSize: '0.9rem',
          padding: 8,
        },
        inputMultiline: {
          lineHeight: 1.4,
          minHeight: 125,
          padding: '9px 12px',
        },
        root: {
          '& svg': {
            '&:hover': {
              color: '#5bb3ea',
            },
            color: '#108ad6',
            fontSize: 18,
          },
          '&.Mui-disabled': {
            backgroundColor: '#f4f4f4',
            borderColor: '#c2c2ca',
            color: 'rgba(0, 0, 0, 0.75)',
            input: {
              cursor: 'not-allowed',
            },
            opacity: 0.5,
          },
          '&.Mui-error': {
            borderColor: '#d63c42',
          },
          '&.Mui-focused': {
            '& .select-option-icon': {
              paddingLeft: `30px !important`,
            },
            borderColor: '#108ad6',
            boxShadow: `0 0 2px 1px #d6d6dd`,
          },
          '&.affirmative': {
            borderColor: '#00b050',
          },
          alignItems: 'center',
          backgroundColor: '#ffffff',
          border: `1px solid #c2c2ca`,
          boxSizing: 'border-box',
          // [breakpoints.down('xs')]: {
          //   maxWidth: '100%',
          //   width: '100%',
          // },
          color: '#696970',
          lineHeight: 1,
          maxWidth: 416,
          minHeight: 34,
          transition: 'border-color 225ms ease-in-out',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        positionEnd: {
          marginRight: 10,
        },
        root: {
          '& p': {
            // [breakpoints.only('xs')]: {
            //   fontSize: '1rem',
            // },
            color: '#696970',
            fontSize: '0.9rem',
          },
          // [breakpoints.only('xs')]: {
          //   fontSize: '1rem',
          // },
          color: '#696970',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            opacity: 1,
          },
          height: 'auto',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        formControl: {
          position: 'relative',
        },
        shrink: {
          transform: 'none',
        },
      },
    },
  }
}
