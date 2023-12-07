import { Grid } from '@mui/material'
import MultiSchemaField from '@rjsf/core/lib/components/fields/MultiSchemaField'
import React from 'react'
import { useStyles } from './styles'

export default function (props: any): React.ReactElement {
  const { idSchema, schema, uiSchema, ...rest } = props
  const newUiSchema = { ...uiSchema }
  if (uiSchema['ui:widget'] !== 'hidden' && schema.oneOf.length < 8) newUiSchema['ui:widget'] = 'radio'
  newUiSchema['ui:readonly'] = props?.disabled

  const { classes } = useStyles()
  return (
    <Grid key={`${idSchema.$id}-outer`} className={classes.gridIsOf} item>
      <Grid key={`${idSchema.$id}-field`} item>
        <MultiSchemaField {...rest} idSchema={idSchema} schema={schema} uiSchema={newUiSchema} />
      </Grid>
    </Grid>
  )
}
