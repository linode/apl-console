import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteDialog from './DeleteDialog'

interface DeleteButtonProps {
  dataCy?: string
  onDelete: () => void
  resourceName: string
  resourceType: string
}
export default (props: DeleteButtonProps): React.ReactElement => {
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
      <Button color='primary' startIcon={<DeleteIcon />} variant='contained' onClick={onButtonClick} data-cy={dataCy}>
        Delete
      </Button>
    </>
  )
}
