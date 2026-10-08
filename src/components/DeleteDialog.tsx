import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LoadingButton } from '@mui/lab'

const StyledDeleteButton = styled(LoadingButton)(({ theme }) => ({
  float: 'right',
  textTransform: 'capitalize',
  marginLeft: theme.spacing(2),
  border: '1px solid transparent',
  color: theme.palette.error.contrastText,
  backgroundColor: theme.palette.error.main,
  '&:hover:not(.Mui-disabled)': {
    borderColor: 'transparent',
    backgroundColor: theme.palette.error.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    borderColor: 'transparent',
    color: theme.palette.action.disabled,
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
    <Dialog
      open
      PaperProps={{
        sx: {
          minWidth: '500px',
          borderRadius: 0,
          boxShadow: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          '& .MuiInputBase-root, & .MuiInputLabel-root': {
            fontFamily: (theme) => theme.font.normal,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
          },
          '& .MuiButton-root': {
            borderWidth: '1px',
            borderRadius: 0,
            boxShadow: 'none',
            fontFamily: (theme) => theme.font.normal,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
          },
          '& .MuiButton-outlinedPrimary:not(.Mui-disabled)': {
            color: 'cm.linkActiveLight',
            borderColor: 'cm.textBoxBorder',
            '&:hover': {
              color: 'cm.buttonPrimaryHover',
              borderColor: 'cm.buttonPrimaryHover',
            },
          },
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: (theme) => theme.font.normal, fontWeight: 700 }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: 'text.secondary',
            fontFamily: (theme) => theme.font.normal,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
          }}
        >
          {customContent ? `${customContent} ${dialogContent}` : dialogContent}
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
          color='error'
        >
          Delete
        </StyledDeleteButton>
      </DialogActions>
    </Dialog>
  )
}
