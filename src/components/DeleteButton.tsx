import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeleteDialog from './DeleteDialog'

interface DeleteButtonProps {
  onDelete: () => void
  resourceName: string
  resourceType: string
}
export default function ({ ...other }: DeleteButtonProps): React.ReactElement {
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
      <Button startIcon={<DeleteIcon />} onClick={onButtonClick}>
        {t('delete')}
      </Button>
    </>
  )
}
