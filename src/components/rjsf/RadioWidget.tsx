/* eslint-disable no-empty-pattern */
/* eslint-disable no-underscore-dangle */
import { Typography } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { WidgetProps } from '@rjsf/core'
import { sentenceCase } from 'change-case'
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
  const disabledOptions = [...((enumDisabled as any[]) || [])]
  const { classes } = useStyles()
  const _onChange = ({}, value: any) => onChange(schema.type === 'boolean' ? value !== 'false' : value)
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onBlur(id, value)
  const _onFocus = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value)
  const hasLabel = !!options.hasLabel
  const row = inline || renderOptions.length <= 5
  const useValue = value === undefined || value === null ? schema.default || '' : value
  if (!required && schema.default === undefined && !schema.readOnly) {
    if (renderOptions.length && renderOptions[0].value !== '') renderOptions.unshift({ label: 'Off', value: '' })

    if (value === undefined) {
      // eslint-disable-next-line no-param-reassign
      value = ''
    }
  }
  return (
    <>
      {(hasLabel || schema.title) && <Typography variant='h6'>{label || schema.title}</Typography>}
      <RadioGroup
        classes={classes}
        value={useValue}
        row={row as boolean}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      >
        {renderOptions.map((option: Record<string, any>) => {
          const itemDisabled = disabledOptions && disabledOptions.indexOf(option.value) !== -1

          const radio = (
            <FormControlLabel
              control={<Radio key={option.label} />}
              label={schema.enum ? option.label : sentenceCase(option.label as string)}
              value={option.value}
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
