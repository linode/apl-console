import { Box, Typography } from '@mui/material'
import React from 'react'
import Empty from 'layouts/Empty'
import Iconify from './Iconify'

export default function (props: any): React.ReactElement {
  const comp = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <Typography sx={{ color: '#fff' }} variant='h3'>
        Error {props.code}: {props.extendedMessage.title}
      </Typography>
      <Iconify icon='nonicons:not-found-16' sx={{ color: '#fff', fontSize: '100px' }} />
      <Typography sx={{ align: 'center', color: '#fff', width: '50%' }}>{props.extendedMessage.message}</Typography>
    </Box>
  )
  return <Empty children={comp} />
}
