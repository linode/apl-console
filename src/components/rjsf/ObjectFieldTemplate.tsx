/* eslint-disable no-param-reassign */
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
    if (isHidden(o) || ['allOf', 'anyOf', 'oneOf'].some((p) => p in schema) || ['boolean', 'object'].includes(type)) {
      if (grouped.length) fields.push(grouped)
      fields.push(o)
      grouped = undefined
    } else {
      grouped.push(o)
    }
  })
  // to catch the last iteration
  if (grouped) fields.push(grouped)

  const renderTitleDescription = (props, skipTitle = false): React.ReactElement | undefined => {
    const { idSchema, uiSchema = {}, title, description, required, schema } = props
    if (schema.type === 'boolean' && !skipTitle) return
    const displayTitle = uiSchema['ui:title'] || title || schema.title
    const displayDescription = uiSchema['ui:description'] || description || schema.description
    if (!(displayTitle || displayDescription)) return
    // eslint-disable-next-line no-param-reassign
    if (isOf) skipTitle = true
    // eslint-disable-next-line consistent-return
    return (
      <Grid key={`${idSchema.$id}-header`} className={skipTitle ? classes.headerSkip : classes.header}>
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
      </Grid>
    )
  }

  const render = (o, id = o.name) => {
    const schema = o.content?.props?.schema
    const isOf = isSomeOf(schema)
    const isCustomArray = schema.type === 'array' && schema.uniqueItems && schema.items?.enum
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

    // object/*Ofs we want to elevate in their own paper
    if (!schema.type || schema.type === 'object' || isOf)
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Paper key={id} className={classes.paper}>
            {(isOf || isCustomArray) && (
              <Grid key={idSchema.$id} item className={classes.isOfHeader}>
                {renderTitleDescription(o.content?.props)}
              </Grid>
            )}
            {o.content}
          </Paper>
        </Grid>
      )

    if (isCustomArray) {
      return (
        <Grid key={id} className={classes.gridIsOf} item xs={12}>
          <Paper key={id} className={classes.paper}>
            <Grid key={idSchema.$id} item className={classes.isOfHeader}>
              {renderTitleDescription(o.content?.props)}
            </Grid>
            <Grid key={id} item xs={12} className={classes.gridIsOf}>
              {o.content}
            </Grid>
          </Paper>
        </Grid>
      )
    }

    if (schema.type === 'boolean')
      // array items will get their own grid row
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Grid className={classes.box} container item>
            {o.content}
          </Grid>
          {schema.type === 'boolean' && renderTitleDescription(o.content?.props, true)}
        </Grid>
      )
    // array items will get their own grid row
    if (schema.type === 'array') {
      return (
        <Grid key={id} item xs={12} className={classes.gridIsOf}>
          {o.content}
        </Grid>
      )
    }
    return (
      <Grid key={id} className={classes.grid} item>
        {o.content}
      </Grid>
    )
  }

  return (
    <Grid container spacing={2} className={classes.root}>
      {!isOf && (
        <Grid key={idSchema.$id} item>
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
