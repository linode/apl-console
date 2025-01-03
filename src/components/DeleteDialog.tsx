import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingButton } from '@mui/lab'

interface DeleteDialogProps {
  onCancel: () => void
  onDelete: () => void
  resourceName: string
  resourceType: string
  customContent?: string
  loading: boolean
}

export default function ({
  onCancel,
  onDelete,
  resourceName,
  resourceType,
  customContent,
  loading,
}: DeleteDialogProps): React.ReactElement {
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const { t } = useTranslation()
  // END HOOKS
  const onTextFieldChange = (event) => {
    if (event.target.value === resourceName) setButtonDisabled(false)
    else setButtonDisabled(true)
  }
  const dialogTitle = t('DELETE_RESOURCE', { resourceType, resourceName })
  const dialogContent = t('DELETE_RESOURCE_CONFIRMATION', { resourceType, resourceName })
  return (
    <Dialog open>
      <DialogTitle>{dialogTitle} </DialogTitle>
      <DialogContent>
        <DialogContentText>{customContent ? `${customContent} ${dialogContent}` : dialogContent}</DialogContentText>
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
        <LoadingButton loading={loading} onClick={onCancel} data-cy='button-cancel-delete' variant='outlined'>
          Cancel
        </LoadingButton>
        <LoadingButton
          loading={loading}
          disabled={buttonDisabled}
          onClick={onDelete}
          startIcon={<DeleteIcon />}
          data-cy='button-confirm-delete'
          variant='outlined'
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
