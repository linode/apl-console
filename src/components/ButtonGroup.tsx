import { Box, ButtonGroup, ButtonGroupProps as MuiButtonGroupProps } from '@mui/material'
import React from 'react'
import DeleteButton from './DeleteButton'
import SubmitButton from './SubmitButton'

interface ButtonGroupProps {
  sx?: MuiButtonGroupProps['sx']
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
    <Box display='flex' flexDirection='row-reverse'>
      <ButtonGroup
        {...other}
        sx={[{ borderRadius: 0, boxShadow: 'none' }, ...(Array.isArray(other.sx) ? other.sx : [other.sx])]}
      >
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
