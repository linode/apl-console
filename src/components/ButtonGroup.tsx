import { Box, ButtonGroup } from '@mui/material'
import React from 'react'
import DeleteButton from './DeleteButton'
import SubmitButton from './SubmitButton'

interface ButtonGroupProps {
  id?: string
  loading: boolean
  disabled: boolean
  deleteDisabled?: boolean
  resourceName: string
  resourceType: string
  onDelete: CallableFunction
}
export default function ({
  id,
  loading,
  resourceName,
  resourceType,
  onDelete,
  disabled,
  deleteDisabled,
  ...other
}: ButtonGroupProps): React.ReactElement {
  // END HOOKS
  return (
    <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
      <ButtonGroup {...other}>
        <SubmitButton disabled={disabled} data-cy={`button-submit-${resourceType}`} loading={loading} />
        {id && (
          <DeleteButton
            disabled={deleteDisabled || !id}
            loading={loading}
            onDelete={() => onDelete(id)}
            resourceName={resourceName}
            resourceType={resourceType}
            data-cy={`button-delete-${resourceType}`}
          />
        )}
      </ButtonGroup>
    </Box>
  )
}
