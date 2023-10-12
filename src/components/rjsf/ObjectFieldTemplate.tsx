/* eslint-disable react/no-array-index-key */
import { Divider, Grid, Paper } from '@mui/material'
import { FieldProps, IdSchema, ObjectFieldTemplateProps } from '@rjsf/core'
import { sentenceCase } from 'utils/data'
import { JSONSchema7 } from 'json-schema'
import React from 'react'
import { getSchemaType, hasSomeOf, propsToAccordion } from 'utils/schema'
import DescriptionField from './DescriptionField'
import { useStyles } from './styles'
import TitleField from './TitleField'

export const isHidden = (props?: any): boolean =>
  props?.uiSchema?.['ui:widget'] === 'hidden' || props?.schema?.['x-hidden'] === true

export default function (props: ObjectFieldTemplateProps): React.ReactElement {
  const { properties, idSchema, schema } = props
  const { classes, cx } = useStyles()
  const isOf = hasSomeOf(schema)
  let grouped
  const fields = []
  properties.forEach((o) => {
    if (grouped === undefined) grouped = []
    let schema: JSONSchema7 = o.content.props.schema
    if (schema === 'object') schema = { type: 'object' } as JSONSchema7
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

  const renderTitleDescription = (
    props: FieldProps | ObjectFieldTemplateProps,
    inSkipTitle = undefined,
  ): React.ReactElement | undefined => {
    const { idSchema, title, description, required, schema, uiSchema } = props as ObjectFieldTemplateProps
    const name: string | undefined = (props as FieldProps).name
    const type = getSchemaType(schema)
    if (type === 'boolean' && !inSkipTitle) return
    const docUrl =
      schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
    // we may get the title from the following:
    // const displayTitle = title
    const displayTitle =
      uiSchema['ui:title'] ||
      uiSchema['ui:options']?.title ||
      schema.title ||
      title ||
      (name && type === 'object' && !schema.properties && sentenceCase(name))
    const displayDescription =
      uiSchema['ui:description'] || uiSchema['ui:options']?.description || description || schema.description
    if (!(displayTitle || displayDescription)) return
    const skipTitle =
      inSkipTitle ??
      (schema['x-hideTitle'] || propsToAccordion.includes((uiSchema.title as string) || schema.title || title))
    // eslint-disable-next-line consistent-return
    return (
      <Grid key={`${idSchema?.$id}-header`} className={skipTitle ? classes.headerSkip : classes.header}>
        {displayTitle && !skipTitle && (
          <TitleField
            {...(props as FieldProps)}
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

  const render = (o: FieldProps, id = o.name) => {
    const { idSchema: _idSchema, schema } = (o.content?.props ?? {}) as FieldProps
    const idSchema = (_idSchema ?? {}) as IdSchema
    const type = getSchemaType(schema)
    const isCustomArray = type === 'array' && schema.uniqueItems && (schema.items as JSONSchema7).enum
    const hidden = isHidden(o.content?.props)
    const isOf = hasSomeOf(schema)
    // do not render input fields that are marked with x-nullMe
    if ('x-nullMe' in schema) return null

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

    if (propsToAccordion.includes(id)) return o.content

    // object/*Ofs we want to elevate in their own paper
    if ((type === 'object' || isOf) && !isCustomArray) {
      return (
        <Grid key={id} container>
          <Paper key={`${id}-paper`} className={cx(classes.paper, classes.grid)}>
            {(isOf || (!isOf && type === 'object' && !schema.properties)) && (
              <Grid item key={`${idSchema.$id}-title`}>
                {renderTitleDescription(o.content?.props as FieldProps)}
              </Grid>
            )}
            <Grid key={`${idSchema.$id}-content`}>{o.content}</Grid>
          </Paper>
        </Grid>
      )
    }

    if (isCustomArray || schema.type === 'boolean') {
      // arays, booleans and enums items will get their own grid row
      return (
        <Grid key={id} className={classes.grid} container>
          <Grid className={classes.box} container item>
            {o.content}
          </Grid>
          {renderTitleDescription(o.content?.props as FieldProps, true)}
        </Grid>
      )
    }
    if (schema.type === 'array' || schema.enum) {
      return (
        <Grid key={id} className={classes.grid} container>
          <Grid key={id} item xs={12} className={classes.grid}>
            {o.content}
          </Grid>
          {schema.type !== 'string' && renderTitleDescription(o.content?.props as FieldProps, true)}
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
      {fields.map((o: FieldProps, idx: number) => {
        if (o.length) {
          return (
            //   <FormControl fullWidth key={idx} className={classes.container}>
            //     {o.map(render)}
            //   </FormControl>
            <Grid key={`fields-${idx}`} container className={classes.container}>
              {o.map(render)}
            </Grid>
          )
        }
        return render(o)
      })}
    </Grid>
  )
}
