/* eslint-disable react/no-array-index-key */
import { Box, Grid, Paper } from '@material-ui/core'
import React from 'react'

export default function ObjectFieldTemplate(props: any) {
  const { title, description, properties } = props
  let grouped
  const fields = []
  properties.forEach(o => {
    if (grouped === undefined) grouped = []
    if (o.content.props.schema.type !== 'string') {
      if (grouped.length) fields.push(grouped)
      fields.push(o)
      grouped = undefined
    } else {
      grouped.push(o)
    }
  })
  if (grouped) fields.push(grouped)
  return (
    <Box my={1}>
      <Box>
        <h2>{title}</h2>
        <p>{description}</p>
      </Box>

      {fields.map((o, idx) => {
        if (o.length) {
          return (
            <Grid key={`row-${idx}`} container spacing={3} direction='row' justify='flex-start' alignItems='flex-start'>
              {o.map((element, idz) => (
                <Grid key={`${element.title}-${idz}`} item>
                  {element.content}
                </Grid>
              ))}
            </Grid>
          )
        }
        if (o.content.props.schema.type === 'boolean') {
          return <Box key={`row-${idx}`}>{o.content}</Box>
        }
        if (o.content.props.schema.type === 'array') {
          return <Box key={`row-${idx}`}>{o.content}</Box>
        }
        return (
          <Paper key={`item-${idx}`}>
            <Box margin='1em'>{o.content}</Box>
          </Paper>
        )
      })}
    </Box>
  )
}
