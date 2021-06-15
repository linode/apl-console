/* eslint-disable react/no-array-index-key */
import { Box, Divider, Grid, Paper } from '@material-ui/core'
import React from 'react'
import { ObjectFieldTemplateProps, utils } from '@rjsf/core'
import TitleField from './TitleField'
import AddButton from './AddButton'
import { useStyles } from './styles'
import { isSomeOf } from '../../utils'

const { canExpand } = utils

const isHidden = (element: any): boolean => {
  return element.content?.props?.uiSchema && element.content.props.uiSchema['ui:widget'] === 'hidden'
}

export default (props: ObjectFieldTemplateProps): React.ReactElement => {
  const { DescriptionField, disabled, formData, onAddClick, properties, readonly, idSchema, schema, uiSchema } = props
  const classes = useStyles()
  const isOf = isSomeOf(schema)
  let grouped
  const fields = []
  properties.forEach((o) => {
    if (grouped === undefined) grouped = []
    const schema = o.content.props.schema
    const type = schema.type
    // we group props together that we want to render in their own row
    if (['allOf', 'anyOf', 'oneOf'].some((p) => p in schema) || ['boolean', 'object'].includes(type)) {
      if (grouped.length) fields.push(grouped)
      fields.push(o)
      grouped = undefined
    } else {
      grouped.push(o)
    }
  })
  if (grouped) fields.push(grouped)

  const renderTitleDescription = (props, skipTitle = false): React.ReactElement | undefined => {
    const { idSchema, uiSchema, title, description, required, schema } = props
    if (schema.type === 'boolean' && !skipTitle) return
    const displayTitle = uiSchema['ui:title'] || title || schema.title
    const displayDescription = uiSchema['ui:description'] || description || schema.description
    if (!(displayTitle || displayDescription)) return
    // eslint-disable-next-line consistent-return
    return (
      <Box key={`${idSchema.$id}-header`} className={classes[`header${skipTitle ?? 'Skip'}`]}>
        {displayTitle && !skipTitle && (
          <TitleField
            {...props}
            key={`${idSchema.$id}-title`}
            id={`${idSchema.$id}-title`}
            title={displayTitle}
            required={required}
            docUrl={schema['x-externalDocsPath']}
          />
        )}
        {displayDescription && skipTitle && <Divider />}
        {displayDescription && (
          <DescriptionField
            key={`${idSchema.$id}-description`}
            id={`${idSchema.$id}-description`}
            description={displayDescription}
          />
        )}
      </Box>
    )
  }

  const render = (o, id = o.name) => {
    const schema = o.content?.props?.schema
    const isOf = isSomeOf(schema)
    const hidden = isHidden(o)
    if (hidden) {
      if (!schema.properties && !isOf)
        return (
          <span id={id} key={id}>
            {o.content}
          </span>
        )
      return undefined
    }
    if (hidden) {
      return (
        <span id={id} key={id}>
          {o.content}
        </span>
      )
    }
    // object/*Ofs we want to elevate in their own paper
    if (schema.type === 'object' || isOf)
      return (
        <Paper key={id} className={classes.paper}>
          <Grid className={classes.grid} container>
            {isOf && renderTitleDescription(o.content?.props)}
            {o.content}
          </Grid>
        </Paper>
      )

    if (schema.type === 'array' && !schema.items.enum)
      // array items will get their own grid row
      return (
        <Grid key={id} container>
          {o.content}
        </Grid>
      )

    if ((schema.type === 'array' && !schema.items.enum) || schema.type === 'boolean')
      // array items will get their own grid row
      return (
        <Grid key={id} className={classes.grid} container>
          <Grid className={classes.box} container item>
            {o.content}
          </Grid>
          {schema.type === 'boolean' && renderTitleDescription(o.content?.props, true)}
        </Grid>
      )
    return (
      <Grid key={id} className={classes.grid} item>
        <Box className={classes.box}>{o.content}</Box>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2} className={classes.root}>
      {!isOf && (
        <Grid key={idSchema.$id} container>
          {renderTitleDescription(props)}
        </Grid>
      )}
      {fields.map((o: any, idx: number) => {
        if (o.length)
          return (
            <Grid key={idx} container>
              {o.map((el, idz) => render(el, idz))}
            </Grid>
          )
        return render(o)
      })}
      {canExpand(schema, uiSchema, formData) && (
        <Grid container justify='flex-end' className={classes.grid}>
          <Grid item>
            <Box mt={2}>
              <AddButton
                className='object-property-expand'
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
