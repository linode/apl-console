/* eslint-disable react/no-array-index-key */
import React from 'react'

import { FieldTemplateProps } from '@rjsf/core'

import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

import WrapIfAdditional from './WrapIfAdditional'

export default ({
  id,
  children,
  disabled,
  displayLabel,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  rawErrors = [],
  rawHelp,
  rawDescription,
  schema,
}: FieldTemplateProps) => {
  // @ts-ignore
  let isCustomArray = schema.type === 'array' && schema.uniqueItems && schema.items?.enum
  if (schema.type === 'string' && schema.enum) isCustomArray = true
  const hideDescription = isCustomArray || ['allOf', 'anyOf', 'oneOf', 'properties'].some((p) => p in schema)

  return (
    <WrapIfAdditional
      disabled={disabled}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
    >
      <FormControl fullWidth error={!!rawErrors.length} required={required}>
        {children}
        {!hideDescription && displayLabel && rawDescription ? (
          <Typography variant='caption' color='textSecondary'>
            {rawDescription}
          </Typography>
        ) : null}
        {rawErrors.length > 0 && (
          <List dense disablePadding>
            {rawErrors.map((error, i: number) => {
              return (
                <ListItem key={`key-${i}`} disableGutters>
                  <FormHelperText id={id}>{error}</FormHelperText>
                </ListItem>
              )
            })}
          </List>
        )}
        {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
      </FormControl>
    </WrapIfAdditional>
  )
}
