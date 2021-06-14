/* eslint-disable react/no-array-index-key */
import { Box, Grid, Paper } from '@material-ui/core'
import React from 'react'
import { ObjectFieldTemplateProps, utils } from '@rjsf/core'
import TitleField from './TitleField'
import AddButton from './AddButton'
import { useStyles } from './styles'

const { canExpand } = utils

const isHidden = (element: any): boolean => {
  return element.content?.props?.uiSchema && element.content.props.uiSchema['ui:widget'] === 'hidden'
}

export default (props: ObjectFieldTemplateProps): React.ReactElement => {
  const { DescriptionField, disabled, formData, onAddClick, properties, readonly, schema, uiSchema } = props
  const classes = useStyles()
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

  const renderHead = (props): React.ReactElement | undefined => {
    const { idSchema, uiSchema, title, description, required, schema } = props
    const displayTitle = uiSchema['ui:title'] || title || schema.title
    const displayDescription = uiSchema['ui:description'] || description || schema.description
    if (!(displayTitle || displayDescription)) return
    // eslint-disable-next-line consistent-return
    return (
      <Box key={`${idSchema.$id}-header`} className={classes.header}>
        {displayTitle && (
          <TitleField
            {...props}
            key={`${idSchema.$id}-title`}
            id={`${idSchema.$id}-title`}
            title={displayTitle}
            required={required}
            docUrl={schema['x-externalDocsPath']}
          />
        )}
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
    if (isHidden(o)) {
      return (
        <span id={id} key={id}>
          {o.content}
        </span>
      )
    }
    const schema = o.content?.props?.schema
    const isSomeOf = ['allOf', 'anyOf', 'oneOf'].some((p) => p in schema)
    // const isTopLevel = Object.prototype.hasOwnProperty.call(o.content.props.registry.rootSchema.properties, o.name)
    // object/*Ofs we want to elevate in their own paper
    if (schema.type === 'object' || isSomeOf)
      return (
        <Grid key={id} className={classes.grid} container>
          <Paper className={classes.paper}>
            {/* due to a bug in rjsf we sometimes don't see title rendered for *Of, so we do it here 
                In order to make this work we also disable the title rendering in the TitleTemplate for those occasions. */}
            {isSomeOf && renderHead(o.content?.props)}
            {o.content}
          </Paper>
        </Grid>
      )

    if (schema.type === 'array' || schema.type === 'boolean')
      // array items will get their own grid row
      return (
        <Grid key={id} className={classes.grid} container>
          {o.content}
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
      {renderHead(props)}
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
