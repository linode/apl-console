import { Box, CssBaseline, Typography } from '@mui/material'
import React from 'react'
import Empty from 'layouts/Empty'
import Iconify from './Iconify'

export default function (props: any): React.ReactElement {
  const comp = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <CssBaseline />
      <Typography sx={{ textAlign: 'center', color: '#fff' }} variant='h3'>
        ERROR {props.code}: {props.extendedMessage.title}
      </Typography>
      <Iconify icon='nonicons:not-found-16' sx={{ color: '#fff', fontSize: '100px' }} />
      <Typography
        sx={{ textAlign: 'center', display: 'flex', justifyContent: 'space-around', color: '#fff', width: '50%' }}
      >
        {props.extendedMessage.message}
      </Typography>
    </Box>
  )
  return <Empty children={comp} />
}
