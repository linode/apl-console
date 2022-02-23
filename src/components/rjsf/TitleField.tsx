import { Box, Divider, Typography } from '@mui/material'
import { FieldProps } from '@rjsf/core'
import HelpButton from 'components/HelpButton'
import React from 'react'

interface Props extends FieldProps {
  docUrl?: string
}

export default function ({ id, title, docUrl, variant = 'h6' }: Props) {
  return (
    <Box mb={1} mt={1}>
      <Typography variant={variant}>
        {title} {docUrl && <HelpButton id={`doc-${id}`} href={docUrl} icon />}
      </Typography>
      <Divider />
    </Box>
  )
}
