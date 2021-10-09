import React from 'react'

import { FieldProps } from '@rjsf/core'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import HelpButton from '../HelpButton'

interface Props extends FieldProps {
  docUrl?: string
}

const TitleField = ({ id, title, docUrl, variant = 'h5' }: Props) => {
  return (
    <Box mb={1} mt={1}>
      <Typography variant={variant}>
        {title} {docUrl && <HelpButton id={`doc-${id}`} href={docUrl} icon />}
      </Typography>
      <Divider />
    </Box>
  )
}

export default TitleField
