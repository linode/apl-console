import React, { useState } from 'react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface DeleteDialogProps {
  onCancel: () => void
  onDelete: () => void
  resourceName: string
  resourceType: string
}

export default (props: DeleteDialogProps): React.ReactElement => {
  const { onCancel, onDelete, resourceName, resourceType } = props
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const onTextFieldChange = event => {
    if (event.target.value === resourceName) setButtonDisabled(false)
    else setButtonDisabled(true)
  }

  return (
    <>
      <Dialog open>
        <DialogTitle>
          Delete {resourceName} {resourceType}{' '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{`Type the name of the ${resourceType} ("${resourceName}") to confirm.`}</DialogContentText>
          <TextField
            autoComplete='off'
            margin='dense'
            onChange={onTextFieldChange}
            variant='outlined'
            label={`${resourceType} name`}
            fullWidth
            data-cy='confirmation-text'
          />
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={onCancel} variant='contained' data-cy='button-cancel-delete'>
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={buttonDisabled}
            onClick={onDelete}
            startIcon={<DeleteIcon />}
            variant='contained'
            data-cy='button-confirm-delete'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
