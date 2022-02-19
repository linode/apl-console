/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import { Divider, Grid, Paper } from '@mui/material'
import React from 'react'
import { ObjectFieldTemplateProps } from '@rjsf/core'
import { getSchemaType, hasSomeOf, isOneOf } from 'utils/schema'
import TitleField from './TitleField'
import { useStyles } from './styles'
import DescriptionField from './DescriptionField'

const isHidden = (element: any): boolean =>
  element.content?.props?.uiSchema && element.content.props.uiSchema['ui:widget'] === 'hidden'

export const renderTitleDescription = (props, skipTitle, classes): React.ReactElement | undefined => {
  const { idSchema, uiSchema = {}, title, description, name, required, schema } = props
  const type = getSchemaType(schema)
  if (type === 'boolean' && !skipTitle) return
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  // we may get the title from the following:
  const displayTitle =
    uiSchema['ui:title'] || title || schema.title || (type === 'object' && !schema.properties && name)
  const displayDescription = uiSchema['ui:description'] || description || schema.description
  if (!(displayTitle || displayDescription)) return
  const isOf = hasSomeOf(schema)
  const oneOf = isOneOf(schema)
  // eslint-disable-next-line no-param-reassign
  if (skipTitle === undefined && oneOf) skipTitle = true
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
          docUrl={skipTitle !== false && docUrl}
        />
      )}
      {displayDescription && skipTitle && <Divider />}
      {displayDescription && !isOf && (
        <DescriptionField
          key={`${idSchema.$id}-description`}
          id={`${idSchema.$id}-description`}
          description={displayDescription}
        />
      )}
    </Grid>
  )
}

export default (props: ObjectFieldTemplateProps): React.ReactElement => {
  const { DescriptionField, properties, idSchema, schema } = props
  const { classes } = useStyles()
  const isOf = hasSomeOf(schema)
  let grouped
  const fields = []
  properties.forEach((o) => {
    if (grouped === undefined) grouped = []
    let { schema } = o.content.props
    if (schema === 'object') schema = {}
    const type = getSchemaType(schema)
    // we group props together that we want to render in their own row
    if (isHidden(o) || isOf || ['boolean', 'object'].includes(type)) {
      if (grouped.length) fields.push(grouped)
      fields.push(o)
      grouped = undefined
    } else {
      grouped.push(o)
    }
  })
  // to catch the last iteration
  if (grouped) fields.push(grouped)

  const render = (o, id = o.name) => {
    const schema = o.content?.props?.schema
    const isOf = hasSomeOf(schema)
    const type = getSchemaType(schema)
    const isCustomArray = type === 'array' && schema.uniqueItems && schema.items?.enum
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
    if (type === 'object' || isOf)
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Paper key={id} className={classes.paper}>
            {(isOf || (type === 'object' && !schema.properties) || isCustomArray) && (
              <Grid key={idSchema.$id} item className={classes.gridIsOf}>
                {renderTitleDescription(o.content?.props, undefined, classes)}
              </Grid>
            )}
            <Grid key={idSchema.$id} item>
              {o.content}
            </Grid>
          </Paper>
        </Grid>
      )

    if (isCustomArray) {
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Paper key={id} className={classes.paper}>
            <Grid key={idSchema.$id} item>
              {renderTitleDescription(o.content?.props, undefined, classes)}
            </Grid>
            <Grid key={id} item xs={12} className={classes.grid}>
              {o.content}
            </Grid>
          </Paper>
        </Grid>
      )
    }

    if (schema.type === 'boolean' || (schema.type === 'string' && schema.enum))
      // arays, booleans and enums items will get their own grid row
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Grid className={classes.box} container item>
            {o.content}
          </Grid>
          {renderTitleDescription(o.content?.props, true, classes)}
        </Grid>
      )
    if (schema.type === 'array') {
      return (
        <Grid key={id} item xs={12} className={classes.grid}>
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
          {renderTitleDescription(props, undefined, classes)}
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
    </Grid>
  )
}
