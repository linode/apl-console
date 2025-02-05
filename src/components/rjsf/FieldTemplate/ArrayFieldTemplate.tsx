import React from 'react'
import { ArrayFieldTemplateProps } from '@rjsf/utils'
import { Box, Grid, IconButton, Paper } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import RemoveIcon from '@mui/icons-material/Remove'
import AddButton from '../AddButton'

function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const { schema, registry } = props

  if (registry.schemaUtils.isMultiSelect(schema)) return <DefaultFixedArrayFieldTemplate {...props} />

  return <DefaultNormalArrayFieldTemplate {...props} />
}

// Used in the two templates
function DefaultArrayItem(props: any) {
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: 'bold',
    minWidth: 0,
  }
  return (
    <Grid container key={props.key} alignItems='center'>
      <Grid item xs style={{ overflow: 'auto' }}>
        <Box mb={2}>
          <Paper elevation={2}>
            <Box p={2}>{props.children}</Box>
          </Paper>
        </Box>
      </Grid>

      {props.hasToolbar && (
        <Grid item>
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              size='small'
              className='array-item-move-up'
              tabIndex={-1}
              style={btnStyle as any}
              disabled={props.disabled || props.readonly || !props.hasMoveUp}
              onClick={props.onReorderClick(props.index, props.index - 1)}
            >
              <ArrowUpwardIcon fontSize='small' />
            </IconButton>
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              size='small'
              tabIndex={-1}
              style={btnStyle as any}
              disabled={props.disabled || props.readonly || !props.hasMoveDown}
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              onClick={props.onReorderClick(props.index, props.index + 1)}
            >
              <ArrowDownwardIcon fontSize='small' />
            </IconButton>
          )}

          {props.hasRemove && (
            <IconButton
              size='small'
              tabIndex={-1}
              style={btnStyle as any}
              disabled={props.disabled || props.readonly}
              onClick={props.onDropIndexClick(props.index)}
            >
              <RemoveIcon fontSize='small' />
            </IconButton>
          )}
        </Grid>
      )}
    </Grid>
  )
}

function DefaultFixedArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  return (
    <fieldset className={props.className}>
      {(props.uiSchema?.['ui:description'] || props.schema.description) && (
        <div className='field-description' key={`field-description-${props.idSchema.$id}`}>
          {props.uiSchema?.['ui:description'] || props.schema.description}
        </div>
      )}

      <div className='row array-item-list' key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map(DefaultArrayItem)}
      </div>

      {props.canAdd && (
        <AddButton className='array-item-add' onClick={props.onAddClick} disabled={props.disabled || props.readonly} />
      )}
    </fieldset>
  )
}

function DefaultNormalArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  return (
    <Paper elevation={2}>
      <Box p={2}>
        <Grid container key={`array-item-list-${props.idSchema.$id}`}>
          {props.items && props.items.map((p) => DefaultArrayItem(p))}

          {props.canAdd && (
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Box mt={2}>
                  <AddButton
                    className='array-item-add'
                    onClick={props.onAddClick}
                    disabled={props.disabled || props.readonly}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  )
}

export default ArrayFieldTemplate
