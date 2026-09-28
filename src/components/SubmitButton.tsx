import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import { styled } from '@mui/material/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'

const StyledSubmitButton = styled(LoadingButton)(({ theme }) => ({
  border: '1px solid transparent',
  borderRadius: 0,
  boxShadow: 'none',
  fontFamily: theme.font?.normal,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  '&.MuiButton-containedPrimary:not(.Mui-disabled):not([aria-disabled="true"])': {
    backgroundColor: theme.palette.cm?.linkActiveLight ?? theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.cm?.buttonPrimaryHover ?? theme.palette.primary.dark,
    },
  },
  '&:hover, &:active': {
    boxShadow: 'none',
  },
}))

export default function ({ loading, ...other }: LoadingButtonProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  return (
    <StyledSubmitButton type='submit' {...other} loading={loading} variant='contained'>
      {t('submit')}
    </StyledSubmitButton>
  )
}
