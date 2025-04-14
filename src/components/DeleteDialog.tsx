import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { darken, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LoadingButton } from '@mui/lab'

const StyledDeleteButton = styled(LoadingButton)(({ theme }) => ({
  float: 'right',
  textTransform: 'capitalize',
  marginLeft: theme.spacing(2),
  border: 'none',
  color: 'white',
  backgroundColor: theme.palette.cm.red,
  '&:hover': {
    border: 'none',
    backgroundColor: darken(theme.palette.cm.red as string, 0.2),
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[400],
    border: 'none',
    color: theme.palette.common.white,
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white,
    },
  },
}))

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

  const onTextFieldChange = (event) => {
    if (event.target.value === resourceName) setButtonDisabled(false)
    else setButtonDisabled(true)
  }

  const dialogTitle = t('DELETE_RESOURCE', { resourceType, resourceName })
  const dialogContent = t('DELETE_RESOURCE_CONFIRMATION', { resourceType, resourceName })

  return (
    <Dialog open PaperProps={{ sx: { minWidth: '500px' } }}>
      <DialogTitle>{dialogTitle}</DialogTitle>
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
        <StyledDeleteButton
          loading={loading}
          disabled={buttonDisabled}
          onClick={onDelete}
          startIcon={<DeleteIcon />}
          data-cy='button-confirm-delete'
          variant='outlined'
        >
          Delete
        </StyledDeleteButton>
      </DialogActions>
    </Dialog>
  )
}
