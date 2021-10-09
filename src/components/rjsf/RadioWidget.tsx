/* eslint-disable no-empty-pattern */
/* eslint-disable no-underscore-dangle */
import React from 'react'
import { makeStyles } from '@material-ui/styles'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import { WidgetProps } from '@rjsf/core'

const useStyles = makeStyles({
  root: {
    padding: 8,
  },
})

const RadioWidget = ({
  id,
  schema,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { enumOptions, enumDisabled } = options
  const renderOptions = [...(enumOptions as any[])]
  const classes = useStyles()
  const _onChange = ({}, value: any) => onChange(schema.type === 'boolean' ? value !== 'false' : value)
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onBlur(id, value)
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value)
  const hasLabel = !!options.hasLabel
  const row = options && options.inline ? options.inline : renderOptions.length <= 7
  if (renderOptions[0].label === '') renderOptions[0] = { label: 'Off', value: '' }
  return (
    <>
      {hasLabel && (
        <FormLabel required={required} htmlFor={id}>
          {label || schema.title}
        </FormLabel>
      )}
      <RadioGroup
        classes={classes}
        value={`${value === undefined || value === null ? '' : value}`}
        row={row as boolean}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      >
        {(renderOptions as any).map((option: any) => {
          const itemDisabled = enumDisabled && (enumDisabled as any).indexOf(option.value) !== -1

          const radio = (
            <FormControlLabel
              control={<Radio color='primary' key={option.label} />}
              label={`${option.label}`}
              value={`${option.value}`}
              key={option.label}
              disabled={disabled || itemDisabled || readonly}
              data-cy={`radio-${id}-${value}`}
            />
          )

          return radio
        })}
      </RadioGroup>
    </>
  )
}

export default RadioWidget
