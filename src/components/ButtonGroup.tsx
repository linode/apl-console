import { Box, ButtonGroup } from '@mui/material'
import React from 'react'
import DeleteButton from './DeleteButton'
import SubmitButton from './SubmitButton'

interface ButtonGroupProps {
  id?: string
  disabled: boolean
  resourceName: string
  resourceType: string
  onDelete: CallableFunction
}
export default function ({ id, resourceName, resourceType, onDelete, ...other }: ButtonGroupProps): React.ReactElement {
  // END HOOKS
  return (
    <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
      <ButtonGroup {...other}>
        <SubmitButton data-cy={`button-submit-${resourceType}`} />
        {id && (
          <DeleteButton
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
