import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteDialog from './DeleteDialog'

interface DeleteButtonProps {
  disabled?: boolean
  loading?: boolean
  onDelete: () => void
  resourceName: string
  resourceType: string
  customContent?: string
  sx?: any
}
export default function ({ loading, disabled, sx, ...other }: DeleteButtonProps): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useTranslation()
  // END HOOKS

  const onButtonClick = () => {
    setDialogOpen(true)
  }

  const onDialogCancel = () => {
    setDialogOpen(false)
  }
  return (
    <>
      {dialogOpen && <DeleteDialog onCancel={onDialogCancel} loading={loading} {...other} />}
      <LoadingButton
        disabled={disabled}
        startIcon={<DeleteIcon />}
        onClick={onButtonClick}
        loading={loading}
        variant='contained'
        sx={{ ...sx }}
      >
        {t('delete')}
      </LoadingButton>
    </>
  )
}
