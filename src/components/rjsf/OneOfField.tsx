import React from 'react'
import MultiSchemaField from '@rjsf/core/lib/components/fields/MultiSchemaField'
import { Grid, Paper } from '@mui/material'
import RadioWidget from './RadioWidget'
import { useStyles } from './styles'
import { renderTitleDescription } from './ObjectFieldTemplate'

export default (props: any): React.ReactElement => {
  const { idSchema, schema, uiSchema, ...rest } = props
  const newUiSchema = { ...uiSchema }
  if (schema.oneOf.length < 7) newUiSchema['ui:widget'] = RadioWidget
  const { classes } = useStyles()
  return <MultiSchemaField {...rest} idSchema={idSchema} schema={schema} uiSchema={newUiSchema} />
  // return (
  //   <Grid key={`${idSchema.$id}-outer`} className={classes.gridIsOf} item>
  //     {/* <Paper key={`${idSchema.$id}-paper`} className={classes.paper}> */}
  //     {/* <Grid key={`${idSchema.$id}-title`} className={classes.gridIsOf} item>
  //         {renderTitleDescription(props, false, classes)}
  //       </Grid> */}
  //     <Grid key={`${idSchema.$id}-field`} item>
  //       <MultiSchemaField {...rest} idSchema={idSchema} schema={schema} uiSchema={newUiSchema} />
  //     </Grid>
  //     {/* </Paper> */}
  //   </Grid>
  // )
}
