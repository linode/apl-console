import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { FormControlLabel } from 'components/FormControlLabel'
import { Typography } from 'components/Typography'
import { styled } from '@mui/material'
import { Checkbox } from './Checkbox'

const StyledTypography = styled(Typography, { label: 'StyledTypography' })(({ theme }) => ({
  marginTop: -8,
  paddingLeft: `calc(${theme.spacing(2)} + 18px)`, // 34,
  [theme.breakpoints.up('md')]: {
    paddingLeft: `calc(${theme.spacing(4)} + 18px)`, // 50
  },
}))

const StyledFormControlLabel = styled(FormControlLabel, {
  label: 'StyledFormControlLabel',
})(({ theme }) => ({
  '& > span:last-child': {
    color: theme.palette.cm.headline,
    fontFamily: theme.font.bold,
    fontSize: '1rem',
    lineHeight: '1.2em',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(2),
    },
  },
}))

interface ControlledCheckboxProps {
  name: string
  control: Control<any>
  disabled?: boolean
  label: string
  explainerText?: string
  [x: string]: any // For any additional props like data-testid
}

export default function ControlledCheckbox(props: ControlledCheckboxProps) {
  const { name, disabled, control, label, explainerText } = props
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <StyledFormControlLabel
            control={<Checkbox disabled={disabled} {...field} checked={field.value || false} {...props} />}
            label={label}
          />
        )}
      />
      {explainerText && <StyledTypography variant='body1'>{explainerText}</StyledTypography>}
    </>
  )
}
