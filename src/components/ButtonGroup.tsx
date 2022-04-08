import { Box, ButtonGroup } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import DeleteButton from './DeleteButton'
import SubmitButton from './SubmitButton'

const useStyles = makeStyles()((theme) => ({
  head: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiGrid-item': {
      padding: '16px !important',
    },
  },
}))

interface ButtonGroupProps {
  id?: string
  loading: boolean
  disabled: boolean
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
  ...other
}: ButtonGroupProps): React.ReactElement {
  // END HOOKS
  return (
    <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
      <ButtonGroup {...other}>
        <SubmitButton disabled={disabled} data-cy={`button-submit-${resourceType}`} loading={loading} />
        {id && (
          <DeleteButton
            disabled={!id}
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
