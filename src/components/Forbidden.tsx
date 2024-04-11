import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Iconify from './Iconify'

export default function (): React.ReactElement {
  const history = useHistory()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <Typography variant='h3'>Error 403: Forbidden</Typography>
      <Iconify icon='nonicons:not-found-16' sx={{ fontSize: '100px' }} />
      <Typography sx={{ width: '50%' }}>
        You are not allowed to access this page. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
      </Typography>
      <Button variant='contained' color='primary' onClick={() => history.push('/')}>
        Go To Home
      </Button>
    </Box>
  )
}
