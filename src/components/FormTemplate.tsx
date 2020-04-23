import { Box, Button, Divider, Grid, Paper } from '@material-ui/core'
import React from 'react'

export default function ObjectFieldTemplate(props: any) {
  const { title, description, properties, idSchema } = props
  const simpleElements = []
  const booleanElements = []
  const complexElements = []
  properties.forEach(o => {
    if (o.content.props.schema.type === 'object' || o.content.props.schema.type === 'array') complexElements.push(o)
    else if (o.content.props.schema.type === 'boolean') booleanElements.push(o)
    else simpleElements.push(o)
  })

  return (
    <>
      <Divider />
      <Box my={2}>
        {/* <Paper elevation={3}> */}
        <Box>
          {title}
          {description}
        </Box>

        <Grid container spacing={3} direction='row' justify='flex-start' alignItems='flex-start'>
          {simpleElements.map(element => (
            <Grid item>{element.content}</Grid>
          ))}
        </Grid>
        <Grid container spacing={3} direction='row' justify='flex-start' alignItems='flex-start'>
          {booleanElements.map(element => (
            <Grid item>{element.content}</Grid>
          ))}
        </Grid>
        {complexElements.map(element => (
          <Box>{element.content}</Box>
        ))}
        {/* </Paper> */}
      </Box>
    </>
  )
}

export function CustomFieldTemplate(props: any) {
  const { id, classNames, label, help, required, description, errors, children, schema } = props
  return (
    <div className={classNames}>
      {children}
      {errors}
      {help}
    </div>
  )
}

// export function CustomArrayFieldTemplate(props: any) {
//   return (
//     <div>
//       {props.items.map(element => element.children)}
//       {props.canAdd && <button type='button' onClick={props.onAddClick} />}
//     </div>
//   )
// }
