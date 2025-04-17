import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { Checkbox } from 'components/cmCheckbox/Checkbox'
import { FormControlLabel } from 'components/FormControlLabel'
import { Typography } from 'components/Typography'
import { Box, styled } from '@mui/material'

const StyledFormControlLabel = styled(FormControlLabel, {
  label: 'StyledFormControlLabel',
})(({ theme }) => ({
  '& > span:last-child': {
    color: theme.palette.cm.headline,
    fontFamily: theme.font.bold,
    fontSize: '1rem',
    lineHeight: '1.2em',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(2),
    },
  },
}))

const StyledTypography = styled(Typography, { label: 'StyledTypography' })(({ theme }) => ({
  marginTop: theme.spacing(-4),
  paddingLeft: `calc(${theme.spacing(2)} + 14px)`, // 30
  [theme.breakpoints.up('md')]: {
    paddingLeft: `calc(${theme.spacing(4)} + 14px)`, // 46
  },
  lineHeight: 'normal',
  color: theme.palette.cl.text.subTitle,
  maxWidth: '75%',
  fontSize: 'medium',
}))

interface ControlledCheckboxProps {
  name: string
  control: Control<any>
  disabled?: boolean
  label: string
  explainertext?: string
  [x: string]: any // For any additional props like data-testid
}

export default function ControlledCheckbox(props: ControlledCheckboxProps) {
  const { name, disabled, control, label, explainertext } = props
  return (
    <Box sx={{ pl: '4px', opacity: disabled ? 0.5 : 1 }}>
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
      {explainertext && <StyledTypography variant='body1'>{explainertext}</StyledTypography>}
    </Box>
  )
}
