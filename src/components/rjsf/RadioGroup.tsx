import React from 'react'
import { FormControl, RadioGroup, RadioGroupProps, FormControlLabel, Radio } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    padding: 8,
  },
})

interface CustomRadioGroupProps extends RadioGroupProps {
  options: any
  name: string
  readonly: boolean
  onChange
  inline?: boolean
}

export default ({
  id,
  onChange,
  value,
  options: { enumOptions },
  name,
  readonly,
  inline,
}: CustomRadioGroupProps): React.ReactElement => {
  const classes = useStyles()
  return (
    <FormControl component='fieldset'>
      <RadioGroup
        className={classes.root}
        row={inline !== false}
        aria-label={name}
        name={name}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      >
        {enumOptions.map(({ label, value }) => (
          <FormControlLabel
            disabled={readonly}
            value={value}
            control={<Radio />}
            label={label}
            key={`radio-${id}-${value}`}
            data-cy={`radio-${id}-${value}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
