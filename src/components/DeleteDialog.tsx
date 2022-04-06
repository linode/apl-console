import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DeleteDialogProps {
  onCancel: () => void
  onDelete: () => void
  resourceName: string
  resourceType: string
}

export default function (props: DeleteDialogProps): React.ReactElement {
  const { onCancel, onDelete, resourceName, resourceType } = props
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const { t } = useTranslation()
  // END HOOKS
  const onTextFieldChange = (event) => {
    if (event.target.value === resourceName) setButtonDisabled(false)
    else setButtonDisabled(true)
  }
  return (
    <Dialog open>
      <DialogTitle>{t('DELETE_RESOURCE', { model: resourceType, name: resourceName })} </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('DELETE_RESOURCE_CONFIRMATION', { model: resourceType, name: resourceName })}
        </DialogContentText>
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
        <Button onClick={onCancel} data-cy='button-cancel-delete'>
          Cancel
        </Button>
        <Button disabled={buttonDisabled} onClick={onDelete} startIcon={<DeleteIcon />} data-cy='button-confirm-delete'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
