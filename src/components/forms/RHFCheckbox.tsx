import { FieldValues } from 'react-hook-form'
import {
  CheckboxButtonGroup,
  CheckboxButtonGroupProps,
  CheckboxElement,
  CheckboxElementProps,
} from 'react-hook-form-mui'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  checkboxContainer: {
    marginTop: 20, // Add margin-top here
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    '& .MuiSvgIcon-root': {
      fontSize: 32, // Increase the size of the checkbox
      transform: 'scale(1.5)',
    },
    marginLeft: 4,
  },
  label: {
    fontSize: '1rem', // Adjust the label font size if needed
  },
  '@keyframes tick': {
    '0%': {
      transform: 'scale(0)',
    },
    '50%': {
      transform: 'scale(1.8)',
    },
    '100%': {
      transform: 'scale(1.5)',
    },
  },
  checked: {
    '& .MuiSvgIcon-root': {
      animation: '$tick 0.3s ease-in-out',
    },
  },
})

export function RHFCheckbox<TFieldValues extends FieldValues>({
  disabled,
  validation = {},
  ...other
}: CheckboxElementProps<TFieldValues>) {
  // @ts-ignore
  validation.disabled = disabled
  const classes = useStyles()

  return (
    <div className={classes.checkboxContainer}>
      <CheckboxElement
        className={`${classes.checkbox} ${other.value ? classes.checked : ''}`}
        disabled={disabled}
        validation={validation}
        {...other}
      />
    </div>
  )
}

export function RHFMultiCheckbox<TFieldValues extends FieldValues>({
  ...other
}: CheckboxButtonGroupProps<TFieldValues>) {
  return <CheckboxButtonGroup {...other} />
}
