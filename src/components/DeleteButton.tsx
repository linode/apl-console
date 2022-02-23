import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import DeleteDialog from './DeleteDialog'

interface DeleteButtonProps {
  dataCy?: string
  onDelete: () => void
  resourceName: string
  resourceType: string
}
export default function (props: DeleteButtonProps): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { dataCy } = props
  const onButtonClick = () => {
    setDialogOpen(true)
  }

  const onDialogCancel = () => {
    setDialogOpen(false)
  }
  return (
    <>
      {dialogOpen && <DeleteDialog onCancel={onDialogCancel} {...props} />}
      <Button startIcon={<DeleteIcon />} onClick={onButtonClick} data-cy={dataCy}>
        Delete
      </Button>
    </>
  )
}
