import { Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { FieldProps } from '@rjsf/core'
import HelpButton from 'components/HelpButton'
import React from 'react'

interface Props extends FieldProps {
  docUrl?: string
}

export default function ({ id, title, docUrl, variant = 'h6' }: Props) {
  return (
    <Grid>
      <Typography variant={variant}>
        {title} {docUrl && <HelpButton id={`doc-${id}`} href={docUrl} icon />}
      </Typography>
      <Divider />
    </Grid>
  )
}
