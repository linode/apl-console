import React, { useState } from 'react'
import { Box, Button, IconButton, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Add, Remove } from '@mui/icons-material'

const useStyles = makeStyles({
  itemRow: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  valueField: {
    flex: '0 0 90%',
  },
  addItemButton: {
    marginLeft: '-10px',
    display: 'flex',
    alignItems: 'center',
  },
})

export default function RHFSingleValue() {
  const classes = useStyles()
  const [items, setItems] = useState([''])

  const handleAddItem = () => {
    setItems([...items, ''])
  }

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleChange = (index, value) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  return (
    <Box>
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} className={classes.itemRow}>
          <TextField
            className={classes.valueField}
            label={`Value ${index + 1}`}
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <IconButton onClick={() => handleRemoveItem(index)}>
            <Remove />
          </IconButton>
        </Box>
      ))}
      <Button className={classes.addItemButton} onClick={handleAddItem}>
        <Add /> Add Item
      </Button>
    </Box>
  )
}
