import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import Logout from 'pages/Logout'
import { ApiErrorUnauthorized, ApiErrorUnauthorizedNoGroups, HttpError } from '../utils/error'
import Iconify from './Iconify'

interface Props {
  error?: HttpError
}

export default function ({ error }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const globalError = useAppSelector(({ global: { error } }) => error)
  const { t } = useTranslation('error')
  // END HOOKS
  const err = error ?? globalError
  if (!err) return null
  // return the logout page if the error is a fetch error (session expired)
  if (err?.status === 'FETCH_ERROR') return <Logout fetchError />
  const { title, message, data, code, originalStatus, status } = err || {}
  const errorMessage = title ? `${title}: ${message}` : message || data?.error || data
  const errorCode = code || originalStatus || status || message || data?.error
  const messageKey = errorCode || 'Unknown'

  const clearError = () => {
    dispatch(setError(undefined))
  }
  const tError = `${t('ERROR', { ns: 'error', code: errorCode, msg: t(messageKey) })}`

  let icon
  switch (errorCode) {
    case 'PARSING_ERROR':
    case 401:
    case 403:
      icon = 'ic:baseline-do-not-disturb'
      break
    case 503:
    case 504:
      icon = 'ant-design:api-outlined'
      break
    default:
      icon = 'ic:baseline-error-outline'
      break
  }

  const buttons = () => {
    if (errorCode === 'PARSING_ERROR' || errorCode === 401) {
      return (
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              window.location.href = '/platform-logout'
            }}
          >
            {t('Logout', { ns: 'error' })}
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              window.location.reload()
            }}
          >
            {t('Reload', { ns: 'error' })}
          </Button>
        </Box>
      )
    }

    if (
      errorCode === 503 ||
      errorCode === 504 ||
      err instanceof ApiErrorUnauthorized ||
      err instanceof ApiErrorUnauthorizedNoGroups
    ) {
      return (
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            window.location.href = '/platform-logout'
          }}
        >
          {t('Logout', { ns: 'error' })}
        </Button>
      )
    }

    return (
      <Button
        variant='contained'
        color='primary'
        onClick={() => (globalError?.status === 409 ? clearError() : window.history.back())}
      >
        {t('Back', { ns: 'error' })}
      </Button>
    )
  }

  return (
    <Container sx={{ p: 5 }} maxWidth='lg'>
      <Helmet title={tError} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}
      >
        <Typography variant='h3'>{tError}</Typography>
        <Iconify icon={icon} sx={{ fontSize: '100px' }} />
        <Typography variant='h6' sx={{ width: '50%', textAlign: 'center' }}>
          {errorMessage}
        </Typography>
        {buttons()}
      </Box>
    </Container>
  )
}
