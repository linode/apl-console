import React from 'react'
import { FormControl, RadioGroup, RadioGroupProps, FormControlLabel, Radio } from '@material-ui/core'

interface CustomRadioGroupProps extends RadioGroupProps {
  options: any
  name: string
  readonly: boolean
  onChange
}

export default (props: CustomRadioGroupProps): React.ReactElement => {
  const {
    id,
    onChange,
    value,
    options: { enumOptions },
    name,
    readonly,
  } = props
  return (
    <FormControl component='fieldset'>
      <RadioGroup
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
