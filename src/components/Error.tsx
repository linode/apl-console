import CloseIcon from '@mui/icons-material/Close'
import { Alert, Collapse, Container, Grid, IconButton } from '@mui/material'
import { useSession } from 'common/session-context'
import React from 'react'
import Helmet from 'react-helmet'
import { Trans } from 'react-i18next'
import { Keys as k } from 'translations/keys'
import { makeStyles } from 'tss-react/mui'
import { ErrorApi } from '../utils/error'

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    margin: 0,
  },
  banner: {
    marginTop: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.light,
    padding: theme.spacing(2),
  },
  fullScreen: {
    color: theme.palette.common.white,
  },
}))

interface Props {
  error?: ErrorApi
}

export default function ({ error }: Props): React.ReactElement {
  const { classes } = useStyles()
  const { globalError, setGlobalError } = useSession()
  const err = error ?? globalError
  if (!err) return null
  const { code, message } = err
  const msgKey = k[message] || k.Unknown
  return (
    <Container className={classes.root}>
      <Helmet>
        <title>Error</title>
        <meta name='description' content={`${code}: ${message}`} />
      </Helmet>
      {globalError && (
        <Collapse in={!!err}>
          <Alert
            className={classes.banner}
            severity='error'
            variant='outlined'
            onClick={() => {
              setGlobalError()
            }}
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setGlobalError()
                }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
          >
            <Trans i18nKey={k.ERROR} />: <Trans i18nKey={msgKey} />
          </Alert>
        </Collapse>
      )}
      {error && (
        <Grid className={classes.fullScreen} container direction='row' justifyContent='center' alignItems='center'>
          <h1>
            <Trans>{k.ERROR}</Trans>: <Trans>{msgKey}</Trans>
          </h1>
        </Grid>
      )}
    </Container>
  )
}
