import CloseIcon from '@mui/icons-material/Close'
import { Alert, Collapse, Container, Grid, IconButton } from '@mui/material'
import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { e, h, k } from 'translations/keys'
import { makeStyles } from 'tss-react/mui'
import { ApiError } from '../utils/error'

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    margin: 0,
  },
  banner: {
    marginTop: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.light,
    // padding: theme.spacing(2),
  },
  fullScreen: {
    color: theme.palette.common.white,
  },
}))

interface Props {
  error?: ApiError
}

export default function ({ error }: Props): React.ReactElement {
  const { classes } = useStyles()
  const dispatch = useAppDispatch()
  const globalError = useAppSelector(({ global: { error } }) => error)
  const { t } = useTranslation()
  // END HOOKS
  const err = error ?? globalError
  if (!err) return null
  const code = error ? err.code : err.status
  const message = error ? err.message : err.data.error
  const msgKey = e[message] || h[code] || e.Unknown
  const clearError = () => {
    dispatch(setError(undefined))
  }
  const tErr = `${t(k.ERROR, { code, msg: t(msgKey) })}`
  return (
    <Container className={classes.root}>
      <Helmet title={tErr} />
      {globalError && (
        <Collapse in={!!err}>
          <Alert
            className={classes.banner}
            severity='error'
            variant='outlined'
            onClick={clearError}
            action={
              <IconButton aria-label='close' color='inherit' size='small' onClick={clearError}>
                <CloseIcon fontSize='inherit' />
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
