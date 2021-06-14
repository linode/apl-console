/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import { utils, ArrayFieldTemplateProps, IdSchema } from '@rjsf/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import AddButton from './AddButton'
import IconButton from './IconButton'
import TitleField from './TitleField'

const { isMultiSelect, getDefaultRegistry } = utils

type ArrayFieldTitleProps = {
  TitleField: any
  idSchema: IdSchema
  title: string
  required: boolean
}

const ArrayFieldTitle = ({ TitleField, idSchema, title, required }: ArrayFieldTitleProps) => {
  if (!title) {
    return null
  }

  const id = `${idSchema.$id}__title`
  return <TitleField id={id} title={title} required={required} />
}

type ArrayFieldDescriptionProps = {
  DescriptionField: any
  idSchema: IdSchema
  description: string
}

const ArrayFieldDescription = ({ DescriptionField, idSchema, description }: ArrayFieldDescriptionProps) => {
  if (!description) {
    return null
  }

  const id = `${idSchema.$id}__description`
  return <DescriptionField id={id} description={description} />
}

// Used in the two templates
const DefaultArrayItem = ({
  children,
  disabled,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  hasToolbar,
  index,
  key,
  onDropIndexClick,
  onReorderClick,
  readonly,
}: any) => {
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
    minWidth: 0,
  }
  return (
    <Grid container key={key} alignItems='center'>
      <Grid item xs style={{ overflow: 'auto' }}>
        <Box mb={2}>
          <Paper elevation={2}>
            <Box p={2}>{children}</Box>
          </Paper>
        </Box>
      </Grid>

      {hasToolbar && (
        <Grid item>
          {(hasMoveUp || hasMoveDown) && (
            <IconButton
              icon='arrow-up'
              className='array-item-move-up'
              tabIndex={-1}
              style={btnStyle as any}
              iconProps={{ fontSize: 'small' }}
              disabled={disabled || readonly || !hasMoveUp}
              onClick={onReorderClick(index, index - 1)}
            />
          )}

          {(hasMoveUp || hasMoveDown) && (
            <IconButton
              icon='arrow-down'
              tabIndex={-1}
              style={btnStyle as any}
              iconProps={{ fontSize: 'small' }}
              disabled={disabled || readonly || !hasMoveDown}
              onClick={onReorderClick(index, index + 1)}
            />
          )}

          {hasRemove && (
            <IconButton
              icon='remove'
              tabIndex={-1}
              style={btnStyle as any}
              iconProps={{ fontSize: 'small' }}
              disabled={disabled || readonly}
              onClick={onDropIndexClick(index)}
            />
          )}
        </Grid>
      )}
    </Grid>
  )
}

const DefaultFixedArrayFieldTemplate = ({
  canAdd,
  className,
  disabled,
  idSchema,
  items,
  onAddClick,
  readonly,
  required,
  schema,
  title,
  uiSchema,
}: ArrayFieldTemplateProps) => {
  return (
    <fieldset className={className}>
      <ArrayFieldTitle
        key={`array-field-title-${idSchema.$id}`}
        TitleField={TitleField}
        idSchema={idSchema}
        title={uiSchema['ui:title'] || title}
        required={required}
      />

      {(uiSchema['ui:description'] || schema.description) && (
        <div className='field-description' key={`field-description-${idSchema.$id}`}>
          {uiSchema['ui:description'] || schema.description}
        </div>
      )}

      <div className='row array-item-list' key={`array-item-list-${idSchema.$id}`}>
        {items && items.map(DefaultArrayItem)}
      </div>

      {canAdd && <AddButton className='array-item-add' onClick={onAddClick} disabled={disabled || readonly} />}
    </fieldset>
  )
}

const DefaultNormalArrayFieldTemplate = ({
  canAdd,
  DescriptionField,
  disabled,
  idSchema,
  items,
  onAddClick,
  readonly,
  required,
  schema,
  title,
  uiSchema,
}: ArrayFieldTemplateProps) => {
  return (
    <Paper elevation={2}>
      <Box p={2}>
        <ArrayFieldTitle
          key={`array-field-title-${idSchema.$id}`}
          TitleField={TitleField}
          idSchema={idSchema}
          title={uiSchema['ui:title'] || title}
          required={required}
        />

        {(uiSchema['ui:description'] || schema.description) && (
          <ArrayFieldDescription
            key={`array-field-description-${idSchema.$id}`}
            DescriptionField={DescriptionField}
            idSchema={idSchema}
            description={uiSchema['ui:description'] || schema.description}
          />
        )}

        <Grid container key={`array-item-list-${idSchema.$id}`}>
          {items && items.map((p) => DefaultArrayItem(p))}

          {canAdd && (
            <Grid container justify='flex-end'>
              <Grid item>
                <Box mt={2}>
                  <AddButton className='array-item-add' onClick={onAddClick} disabled={disabled || readonly} />
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  )
}

export default (props: ArrayFieldTemplateProps) => {
  const { schema, registry = getDefaultRegistry() } = props

  // TODO: update types so we don't have to cast registry as any
  if (isMultiSelect(schema, (registry as any).rootSchema)) {
    return <DefaultFixedArrayFieldTemplate {...props} />
  }
  return <DefaultNormalArrayFieldTemplate {...props} />
}
