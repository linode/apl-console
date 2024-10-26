import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { ApiError } from '../utils/error'
import Iconify from './Iconify'

interface Props {
  error?: ApiError
}

const apiCodes = [400, 403]

export default function ({ error }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const globalError = useAppSelector(({ global: { error } }) => error)
  const { t } = useTranslation('error')
  // END HOOKS
  const err = error ?? globalError
  if (!err) return null
  if (err.status === 'FETCH_ERROR') window.location.href = '/'
  const code = err.code || err.originalStatus || err.status
  const message = error ? err.message : err.data.error
  const msgKey = message || code || 'Unknown'

  const clearError = () => {
    dispatch(setError(undefined))
  }
  const tErr = `${t('ERROR', { ns: 'error', code, msg: t(msgKey) })}`
  const icon = apiCodes?.includes(code) ? 'nonicons:not-found-16' : 'nonicons:error-16'
  return (
    <Container maxWidth='lg'>
      <Helmet title={tErr} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}
      >
        <Typography variant='h3'>{tErr}</Typography>
        <Iconify icon={icon} sx={{ fontSize: '100px' }} />
        <Typography sx={{ width: '50%' }}>
          {err?.extendedMessage?.message}
          {/* You are not allowed to access this page. Perhaps you’ve mistyped the URL? Be sure to check your spelling. */}
        </Typography>
        <Button variant='contained' color='primary' onClick={clearError}>
          Clear
        </Button>
      </Box>
    </Container>
  )
}
