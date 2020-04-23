import { Box, Divider, Grid } from '@material-ui/core'
import React from 'react'

export default function ObjectFieldTemplate(props: any) {
  const { title, description, properties } = props
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
      </Box>
    </>
  )
}
