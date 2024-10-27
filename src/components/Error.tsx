import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
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
  if (err.status === 'FETCH_ERROR') window.location.href = '/'
  const { title, message, data, code, originalStatus, status } = err || {}
  const errorMessage = title ? `${title}: ${message}` : message || data?.error
  const errorCode = code || originalStatus || status || message || data?.error
  const messageKey = errorCode || 'Unknown'

  const clearError = () => {
    dispatch(setError(undefined))
  }
  const tError = `${t('ERROR', { ns: 'error', code: errorCode, msg: t(messageKey) })}`

  let icon
  switch (code) {
    case 403:
      icon = 'ic:baseline-do-not-disturb'
      break
    case 504:
      icon = 'ant-design:api-outlined'
      break
    default:
      icon = 'ic:baseline-error-outline'
      break
  }

  const buttons = () => {
    const renderButton = (text: string, onClick: () => void) => (
      <Button variant='contained' color='primary' onClick={onClick}>
        {text}
      </Button>
    )
    if (code === 504 || err instanceof ApiErrorUnauthorized || err instanceof ApiErrorUnauthorizedNoGroups) {
      return renderButton(t('Logout', { ns: 'error' }) as string, () => {
        window.location.href = '/logout-otomi'
      })
    }
    if (status === 409) return renderButton(t('Clear', { ns: 'error' }) as string, clearError)
    // if (code === 409) return renderButton(t('Revert', { ns: 'error' }) as string, clearError)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {renderButton(t('Clear', { ns: 'error' }) as string, clearError)}
        {renderButton(t('Back', { ns: 'error' }) as string, () => window.history.back())}
        {/* {renderButton(t('Reload', { ns: 'error' }) as string, () => window.location.reload())} */}
      </Box>
    )
  }

  console.log({ err })
  // TODO: redirect user to the root page when the session is expired (FETCH_ERROR)
  // TODO: redirect user to the login page when the user is not authenticated (FETCH_ERROR)
  // TODO: check 401 error code and redirect user to the login page
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
