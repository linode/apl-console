/* eslint-disable react/no-array-index-key */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Divider } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { FieldTemplateProps } from '@rjsf/core'
import React from 'react'
import { propsToAccordion } from 'utils/schema'
import WrapIfAdditional from './WrapIfAdditional'

export default function ({
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
  uiSchema,
}: FieldTemplateProps) {
  // @ts-ignore
  let isCustomArray = schema.type === 'array' && schema.uniqueItems && schema.items?.enum
  if (schema.type === 'string' && schema.enum && schema.default) isCustomArray = true
  const hideDescription =
    uiSchema['ui:widget'] === 'hidden' ||
    isCustomArray ||
    ['allOf', 'anyOf', 'oneOf', 'properties'].some((p) => p in schema)

  const accordionize = propsToAccordion.includes(label)
  const accordionized = (children) => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {/* <Box> */}
          <Typography sx={{ textTransform: 'capitalize' }} variant='h6'>
            {label}
          </Typography>
          <Divider variant='fullWidth' />
          {/* </Box> */}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    )
  }

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
      <FormControl fullWidth error={!!rawErrors.length} required={required} sx={{ mt: accordionize && '1rem' }}>
        {accordionize && accordionized(children)}
        {!accordionize && children}
        {!hideDescription && displayLabel && rawDescription ? (
          <Typography variant='caption' color='textSecondary'>
            {rawDescription}
          </Typography>
        ) : null}
        {rawErrors.length > 0 && (
          <List dense disablePadding>
            {rawErrors.map((error, i: number) => (
              <ListItem key={`key-${i}`} disableGutters>
                <FormHelperText id={id}>{error}</FormHelperText>
              </ListItem>
            ))}
          </List>
        )}
        {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
      </FormControl>
    </WrapIfAdditional>
  )
}
