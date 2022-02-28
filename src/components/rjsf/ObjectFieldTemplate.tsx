/* eslint-disable react/no-array-index-key */
import { Divider, Grid, Paper } from '@mui/material'
import { ObjectFieldTemplateProps } from '@rjsf/core'
import { sentenceCase } from 'change-case'
import React from 'react'
import { getSchemaType, hasSomeOf, propsToAccordion } from 'utils/schema'
import DescriptionField from './DescriptionField'
import { useStyles } from './styles'
import TitleField from './TitleField'

const isHidden = (element: any): boolean =>
  element.content?.props?.uiSchema && element.content.props.uiSchema['ui:widget'] === 'hidden'

export default function (props: ObjectFieldTemplateProps): React.ReactElement {
  const { properties, idSchema, schema } = props
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
    } else grouped.push(o)
  })
  // to catch the last iteration
  if (grouped) fields.push(grouped)

  const renderTitleDescription = (props, skipTitle = undefined): React.ReactElement | undefined => {
    const { idSchema = {}, title, description, name, required, schema, uiSchema } = props
    const type = getSchemaType(schema)
    if (type === 'boolean' && !skipTitle) return
    const docUrl =
      schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
    // we may get the title from the following:
    const displayTitle =
      uiSchema.title || schema.title || title || (type === 'object' && !schema.properties && sentenceCase(name))
    // uiSchema['ui:title'] || title || schema.title || (type === 'object' && !schema.properties && sentenceCase(name))
    const displayDescription = uiSchema['ui:description'] || description || schema.description
    if (!(displayTitle || displayDescription)) return
    // const isOf = hasSomeOf(schema)
    // const isOf = hasSomeOf(schema)
    // const oneOf = isOneOf(schema)
    if (skipTitle === undefined) skipTitle = propsToAccordion.includes(uiSchema.title || schema.title || title)
    // eslint-disable-next-line consistent-return
    return (
      <Grid key={`${idSchema.$id}-header`} item className={skipTitle ? classes.headerSkip : classes.header}>
        {displayTitle && !skipTitle && (
          <TitleField
            {...props}
            schema={schema}
            uiSchema={uiSchema}
            key={`${idSchema.$id}-title`}
            id={`${idSchema.$id}-title`}
            title={displayTitle}
            required={required}
            docUrl={skipTitle !== false && docUrl}
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
    const { idSchema = {}, title, schema, uiSchema } = o.content?.props ?? {}
    const type = getSchemaType(schema)
    const isCustomArray = type === 'array' && schema.uniqueItems && schema.items?.enum
    const hidden = isHidden(o)
    if (hidden) {
      if (!schema.properties && !isOf) {
        return (
          <span id={`${id}-hidden`} key={id}>
            {o.content}
          </span>
        )
      }
      return undefined
    }

    if (propsToAccordion.includes(uiSchema.title || schema.title || title)) {
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          {o.content}
        </Grid>
      )
    }

    // object/*Ofs we want to elevate in their own paper
    if (type === 'object' || isOf) {
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Paper key={id} className={classes.paper}>
            {(isOf || (type === 'object' && !schema.properties) || isCustomArray) && (
              <Grid key={idSchema.$id} item className={classes.gridIsOf}>
                {renderTitleDescription(o.content?.props)}
              </Grid>
            )}
            <Grid key={idSchema.$id} item>
              {o.content}
            </Grid>
          </Paper>
        </Grid>
      )
    }

    if (isCustomArray || schema.type === 'boolean' || (schema.type === 'string' && schema.enum)) {
      // arays, booleans and enums items will get their own grid row
      return (
        <Grid key={id} className={classes.grid} item xs={12}>
          <Grid className={classes.box} container item>
            {o.content}
          </Grid>
          {renderTitleDescription(o.content?.props, true)}
        </Grid>
      )
    }
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
          {renderTitleDescription(props)}
        </Grid>
      )}
      {fields.map((o: any, idx: number) => {
        if (o.length) {
          return (
            <Grid key={idx} container className={classes.container}>
              {o.map(render)}
            </Grid>
          )
        }
        return render(o)
      })}
    </Grid>
  )
}
