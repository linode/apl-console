/* eslint-disable no-empty-pattern */
/* eslint-disable no-underscore-dangle */
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { WidgetProps } from '@rjsf/core'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  root: {
    padding: 8,
  },
}))

function RadioWidget({
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
}: WidgetProps) {
  const { inline, enumOptions, enumDisabled } = options
  const renderOptions = [...((enumOptions as any[]) || [])]
  const { classes } = useStyles()
  const _onChange = ({}, value: any) => onChange(schema.type === 'boolean' ? value !== 'false' : value)
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onBlur(id, value)
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value)
  const hasLabel = !!options.hasLabel
  const row = inline || renderOptions.length <= 7
  // if (renderOptions[0].label === '') renderOptions[0] = { label: 'Off', value: undefined }
  if (!required && schema.default === undefined) {
    if (renderOptions.length && renderOptions[0].value !== '') {
      renderOptions.unshift({ label: 'Off', value: '' })
    }
    if (value === undefined) {
      // eslint-disable-next-line no-param-reassign
      value = ''
    }
  }
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
              control={<Radio key={option.label} />}
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
