import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'

interface DeleteButtonProps {
  onDelete: () => void
  confirmationText: string
}

export default function DeleteButton(props: DeleteButtonProps) {
  const { confirmationText, onDelete } = props
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const onTextFieldChange = event => {
    if (event.target.value === confirmationText) setButtonDisabled(false)
    else setButtonDisabled(true)
  }

  return (
    <Box display='flex' m={1}>
      <Box>
        <p>{`Type '${confirmationText}' in order to unlock delete button`}</p>
      </Box>
      <Box flexGrow={1} ml={2}>
        <TextField
          autoComplete='off'
          id='confirmationText'
          margin='dense'
          placeholder='Resource name'
          onChange={onTextFieldChange}
          variant='outlined'
        />
      </Box>
      <Box>
        <Button
          variant='contained'
          color='primary'
          disabled={buttonDisabled}
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Box>
    </Box>
  )
}
