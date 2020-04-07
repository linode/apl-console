import React from 'react'
import { Container, Box, Typography } from '@material-ui/core'
import Helmet from 'react-helmet'

export interface ErrorProps {
  code: number
  msg?: string
}

export default ({ code, msg: inMsg }: ErrorProps): any => {
  let msg = inMsg
  if (!inMsg)
    switch (code) {
      case 401:
        msg = 'Unauthorized'
        break
      default:
        msg = 'Not Found'
    }
  return (
    <Container maxWidth='xs'>
      <Helmet>
        <title>{`${code}: ${msg}`}</title>
        <meta name='description' content={`${code}: ${msg}`} />
      </Helmet>
      <Box justifyContent='center' display='flex' alignItems='center' textAlign='center'>
        <Typography variant='h3'>{msg}</Typography>
      </Box>
    </Container>
  )
}
