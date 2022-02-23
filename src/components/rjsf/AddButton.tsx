import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import React from 'react'

export default function (props): React.ReactElement {
  return (
    <Button {...props}>
      <AddIcon /> Add Item
    </Button>
  )
}
