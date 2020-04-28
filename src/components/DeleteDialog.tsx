import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

interface DeleteDialogProps {
  onCancel: () => void
  onDelete: () => void
  resourceName: string
  resourceType: string
}

export default function DeleteDialog(props: DeleteDialogProps) {
  const { onCancel, onDelete, resourceName, resourceType } = props
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const onTextFieldChange = event => {
    if (event.target.value === resourceName) setButtonDisabled(false)
    else setButtonDisabled(true)
  }

  return (
    <>
      <Dialog open>
        <DialogTitle id='deleteResource'>
          Delete {resourceName} {resourceType}{' '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{`Type the name of the ${resourceType} ("${resourceName}") to confirm.`}</DialogContentText>
          <TextField
            autoComplete='off'
            id='confirmationText'
            margin='dense'
            onChange={onTextFieldChange}
            variant='outlined'
            label={`${resourceType} name`}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={onCancel} variant='contained'>
            Cancel
          </Button>
          <Button
            color='primary'
            disabled={buttonDisabled}
            onClick={onDelete}
            startIcon={<DeleteIcon />}
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
