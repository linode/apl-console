/* eslint-disable no-underscore-dangle */
import { FormControlLabel } from '@mui/material'
import { WidgetProps, utils } from '@rjsf/core'
import { sentenceCase } from 'change-case'
import Checkbox from 'components/Checkbox'
import React from 'react'

const { schemaRequiresTrueValue } = utils

export default function (props: WidgetProps) {
  const { schema, uiSchema, id, value, disabled, readonly, label, autofocus, onChange, onBlur, onFocus } = props
  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  const checked =
    typeof value === 'undefined' ? schema['x-default'] !== undefined && schema['x-default'] : Boolean(value)
  const required = schemaRequiresTrueValue(schema)

  const _onChange = (_, checked: boolean) => onChange(checked)
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLButtonElement>) => onBlur(id, value)
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLButtonElement>) => onFocus(id, value)
  const indeterminate = schema['x-default'] !== undefined && schema['x-default'] === !!checked
  const labelText = uiSchema.title || schema.title ? label : sentenceCase(label || '')

  return (
    <FormControlLabel
      control={
        <Checkbox
          id={id}
          checked={checked}
          required={required}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onChange={_onChange}
          onBlur={_onBlur}
          onFocus={_onFocus}
          indeterminate={indeterminate}
        />
      }
      label={labelText}
    />
  )
}
