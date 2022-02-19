import React from 'react'
import { Box } from '@mui/material'

export default ({ children, value, index, ...other }: any): React.ReactElement => (
  <div
    role='tabpanel'
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
)
