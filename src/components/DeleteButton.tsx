import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material'
import DeleteDialog from './DeleteDialog'

const StyledDeleteButton = styled(LoadingButton)(({ theme }) => ({
  float: 'right',
  textTransform: 'capitalize',
  marginLeft: theme.spacing(2),
  border: '1px solid transparent',
  borderRadius: 0,
  boxShadow: 'none',
  fontFamily: theme.font.normal,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  '&:hover:not(.Mui-disabled)': {
    backgroundColor: theme.palette.error.dark,
    boxShadow: 'none',
  },
}))

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
      <StyledDeleteButton
        disabled={disabled}
        startIcon={<DeleteIcon />}
        onClick={onButtonClick}
        loading={loading}
        variant='contained'
        color='error'
        sx={{ ...sx }}
      >
        {t('delete')}
      </StyledDeleteButton>
    </>
  )
}
