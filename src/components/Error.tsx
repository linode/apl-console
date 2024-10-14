import CloseIcon from '@mui/icons-material/Close'
import { Alert, Collapse, Container, Grid, IconButton } from '@mui/material'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { makeStyles } from 'tss-react/mui'
import snack from 'utils/snack'
import { ApiError } from '../utils/error'
import ErrorApi from './ErrorApi'

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    margin: 0,
  },
  banner: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
    // padding: theme.spacing(2),
  },
  fullScreen: {
    color: theme.palette.common.white,
  },
}))

interface Props {
  error?: ApiError
}
const apiCodes = [403, 409, 504, 666]

export default function ({ error }: Props): React.ReactElement {
  const { classes } = useStyles()
  const dispatch = useAppDispatch()
  const globalError = useAppSelector(({ global: { error } }) => error)
  const { t } = useTranslation('error')
  // END HOOKS
  const err = error ?? globalError
  if (!err) return null
  const code = error ? err.code : err.status
  const message = error ? err.message : err.data.error
  const msgKey = message || code || 'Unknown'
  if (apiCodes.includes(code)) return React.createElement(ErrorApi, error)

  const clearError = () => {
    dispatch(setError(undefined))
  }
  const tErr = `${t('ERROR', { ns: 'error', code, msg: t(msgKey) })}`
  snack.error(tErr)
  return (
    <Container className={classes.root}>
      <Helmet title={tErr} />
      {!error && globalError && (
        <Collapse in={!!err}>
          <Alert
            className={classes.banner}
            severity='error'
            variant='outlined'
            onClick={clearError}
            action={
              <IconButton aria-label='close' size='small' onClick={clearError} color='primary'>
                <CloseIcon fontSize='inherit' color='primary' />
              </IconButton>
            }
          >
            {tErr}
          </Alert>
        </Collapse>
      )}
      {error && (
        <Grid className={classes.fullScreen} container direction='row' justifyContent='center' alignItems='center'>
          <h1>{tErr}</h1>
        </Grid>
      )}
    </Container>
  )
}
