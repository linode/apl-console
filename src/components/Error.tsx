import CloseIcon from '@mui/icons-material/Close'
import { Alert, Collapse, Container, Grid, IconButton } from '@mui/material'
import { useSession } from 'common/session-context'
import React from 'react'
import Helmet from 'react-helmet'
import { Trans } from 'react-i18next'
import { Keys as k } from 'translations/keys'
import { makeStyles } from 'tss-react/mui'
import { ErrorRoute } from '../utils/error'

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    paddingTop: theme.spacing(2),
  },
  message: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.light,
    padding: theme.spacing(2),
  },
  messageError: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
  },
}))

interface Props {
  error?: ErrorRoute
}

export default function ({ error }: Props): React.ReactElement {
  const { classes } = useStyles()
  const { globalError, setGlobalError } = useSession()
  const err = error ?? globalError
  if (!err) return null
  const { code, message } = err
  return (
    <Container className={classes.root}>
      <Helmet>
        <title>{`${code}: ${message}`}</title>
        <meta name='description' content={`${code}: ${message}`} />
      </Helmet>
      {globalError && (
        <Collapse in={!!err}>
          <Alert
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
            <Trans i18nKey={k.ERROR}>Error</Trans>: <Trans i18nKey={k[message]} />
          </Alert>
        </Collapse>
      )}
      {error && (
        <Grid className={classes.messageError} container direction='row' justifyContent='center' alignItems='center'>
          <h1>
            <Trans i18nKey={k.ERROR} />: <Trans i18nKey={k[message]} />{' '}
          </h1>
        </Grid>
      )}
    </Container>
  )
}
