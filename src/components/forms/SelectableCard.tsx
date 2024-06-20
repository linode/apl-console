// @ts-nocheck
import React from 'react'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  selected: {
    border: '2px solid #009CDD', // Highlight the selected card with a border
  },
  card: {
    margin: '8px 8px 8px 0', // Apply right margin to all cards
    '&:first-of-type': {
      marginLeft: 0, // No left margin for the first card
    },
  },
})

// eslint-disable-next-line react/prop-types
function SelectableCard({ title, selected, onClick }) {
  const classes = useStyles()

  return (
    <Card className={`${classes.card} ${selected ? classes.selected : ''}`} onClick={onClick}>
      <CardActionArea>
        <CardContent>
          <Typography variant='h6'>{title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default SelectableCard
