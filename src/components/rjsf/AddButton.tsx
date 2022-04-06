import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function (props): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  return (
    <Button {...props}>
      <AddIcon /> {t('add item')}
    </Button>
  )
}
