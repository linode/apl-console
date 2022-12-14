/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import { FormControlLabel, FormGroup, Typography } from '@mui/material'
import { WidgetProps } from '@rjsf/core'
import { sentenceCase } from 'utils/data'
import Checkbox from 'components/Checkbox'
import React from 'react'

const selectValue = (value: any, selected: any, all: any) => {
  const at = all.indexOf(value)
  const updated = selected.slice(0, at).concat(value, selected.slice(at))

  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b))
}

const deselectValue = (value: any, selected: any) => {
  return selected.filter((v: any) => v !== value)
}

export default function ({
  schema,
  label,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) {
  const { enumOptions, enumDisabled, inline } = options

  const _onChange =
    (option: any) =>
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      const all = (enumOptions as any).map(({ value }: any) => value)

      if (checked) onChange(selectValue(option.value, value, all))
      else onChange(deselectValue(option.value, value))
    }

  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLButtonElement>) => onBlur(id, value)
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLButtonElement>) => onFocus(id, value)

  return (
    <>
      <Typography variant='h6'>{label || schema.title}</Typography>
      <FormGroup row={!!inline}>
        {(enumOptions as any).map((option: Record<string, string>, index: number) => {
          const checked = value.includes(option.value)
          const itemDisabled = enumDisabled && (enumDisabled as any).indexOf(option.value) !== -1
          const def = schema.default as string[]
          const indeterminate =
            (schema.default === undefined && !checked) ||
            (schema.default !== undefined &&
              ((checked && def.includes(option.value)) || (!checked && !def.includes(option.value))))
          const checkbox = (
            <Checkbox
              id={`${id}_${index}`}
              checked={checked}
              disabled={disabled || itemDisabled || readonly}
              autoFocus={autofocus && index === 0}
              onChange={_onChange(option)}
              onBlur={_onBlur}
              onFocus={_onFocus}
              indeterminate={indeterminate}
            />
          )
          return <FormControlLabel control={checkbox} key={index} label={sentenceCase(option.label)} />
        })}
      </FormGroup>
    </>
  )
}
