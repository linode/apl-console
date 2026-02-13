import { Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from 'layouts/Paper'
import { useStyles } from './create-edit-catalog.styles'

interface Params {
  catalogId?: string
}

export default function CatalogsCreateEditPage({
  match: {
    params: { catalogId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const { classes } = useStyles()

  const loading = false
  const error = false

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_CATALOG')} />
    </Grid>
  )
}
