import Button, { ButtonProps } from '@mui/material/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ({ ...other }: ButtonProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  return (
    <Button type='submit' {...other}>
      {t('submit')}
    </Button>
  )
}
