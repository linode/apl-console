import React, { useState } from 'react'
import { Box, Button, IconButton, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Add, Remove } from '@mui/icons-material'

const useStyles = makeStyles({
  container: {
    padding: '16px',
    backgroundColor: '#424242',
    borderRadius: '8px',
  },
  itemRow: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  keyField: {
    marginRight: '16px',
    flex: '0 0 30%',
  },
  valueField: {
    flex: '0 0 60%',
  },
  addItemButton: {
    marginLeft: '-10px',
    display: 'flex',
    alignItems: 'center',
  },
})

export default function RHFKeyValue() {
  const classes = useStyles()
  const [items, setItems] = useState([{ key: '', value: '' }])

  const handleAddItem = () => {
    setItems([...items, { key: '', value: '' }])
  }

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  return (
    <Box>
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} className={classes.itemRow}>
          <TextField
            className={classes.keyField}
            label='Name'
            value={item.key}
            onChange={(e) => handleChange(index, 'key', e.target.value)}
          />
          <TextField
            className={classes.valueField}
            label='Value'
            value={item.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
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
