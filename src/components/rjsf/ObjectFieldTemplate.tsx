/* eslint-disable react/no-array-index-key */
import { Box, Grid, Paper } from '@material-ui/core'
import React from 'react'

import { ObjectFieldTemplateProps, utils } from '@rjsf/core'

import AddButton from '@rjsf/core/lib/components/AddButton'
import { makeStyles } from '@material-ui/styles'

const { canExpand } = utils

const isHidden = (element: any): boolean => {
  return element.content?.props?.uiSchema && element.content.props.uiSchema['ui:widget'] === 'hidden'
}

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
})

const renderSimple = (o, idx) => {
  if (isHidden(o)) {
    return o.content
  }
  const schema = o.content?.props?.schema
  if (!['object'].includes(schema.type)) {
    if (schema.type === 'array')
      return (
        <Grid key={`row-${idx}`} container item>
          {o.content}
        </Grid>
      )
    return (
      <Grid key={`${o.title}-${idx}`} item>
        {o.content}
      </Grid>
    )
  }
  return (
    <Paper key={`item-${idx}`}>
      <Box padding='1em' key={`${o.title}-${idx}`}>
        {o.content}
      </Box>
    </Paper>
  )
}

export default ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  disabled,
  readonly,
  uiSchema,
  idSchema,
  schema,
  formData,
  onAddClick,
}: ObjectFieldTemplateProps): React.ReactElement => {
  const classes = useStyles()
  let grouped
  const fields = []
  properties.forEach((o) => {
    if (grouped === undefined) grouped = []
    const type = o.content.props.schema.type
    if (type === 'object') {
      if (grouped.length) fields.push(grouped)
      fields.push(o)
      grouped = undefined
    } else {
      grouped.push(o)
    }
  })
  if (grouped) fields.push(grouped)

  const render = (o, idx) => {
    if (o.length) {
      return (
        <>
          <Grid key={`row-${idx}`} container spacing={3} direction='row' justify='flex-start' alignItems='flex-start'>
            {o.map((el, idz) => {
              return render(el, idz)
            })}
          </Grid>
        </>
      )
    }
    return renderSimple(o, idx)
  }

  return (
    <Box my={1}>
      {/* <Grid container spacing={2} className={classes.root}> */}
      {(uiSchema['ui:title'] || title || description) && (
        <Box>
          {(uiSchema['ui:title'] || title) && (
            <TitleField id={`${idSchema.$id}-title`} title={title} required={required} />
          )}
          {description && <DescriptionField id={`${idSchema.$id}-description`} description={description} />}
        </Box>
      )}
      {fields.map((o: any, idx: number) => {
        return render(o, idx)
      })}
      {canExpand(schema, uiSchema, formData) && (
        <Grid container justify='flex-end'>
          <Grid item>
            <AddButton
              className='object-property-expand'
              onClick={onAddClick(schema)}
              disabled={disabled || readonly}
            />
          </Grid>
        </Grid>
      )}
      {/* </Grid> */}
    </Box>
  )
}
