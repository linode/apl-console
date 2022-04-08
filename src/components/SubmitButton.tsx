import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ({ loading, ...other }: LoadingButtonProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  return (
    <LoadingButton type='submit' {...other} loading={loading} variant='contained'>
      {t('submit')}
    </LoadingButton>
  )
}
