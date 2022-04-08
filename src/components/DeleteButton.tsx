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
}
export default function ({ loading, disabled, ...other }: DeleteButtonProps): React.ReactElement {
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
      {dialogOpen && <DeleteDialog onCancel={onDialogCancel} {...other} />}
      <LoadingButton
        disabled={disabled}
        startIcon={<DeleteIcon />}
        onClick={onButtonClick}
        loading={loading}
        variant='contained'
      >
        {t('delete')}
      </LoadingButton>
    </>
  )
}
