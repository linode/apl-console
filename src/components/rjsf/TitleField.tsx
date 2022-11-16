import { Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { FieldProps } from '@rjsf/core'
import { sentenceCase } from 'utils/data'
import HelpButton from 'components/HelpButton'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends FieldProps {
  docUrl?: string
}

export default function ({ id, title, docUrl, variant = 'h6' }: Props) {
  const { t } = useTranslation()
  return (
    <Grid>
      <Typography variant={variant}>
        {sentenceCase(`${t(title)}`)} {docUrl && <HelpButton id={`doc-${id}`} href={docUrl} icon />}
      </Typography>
      <Divider />
    </Grid>
  )
}
