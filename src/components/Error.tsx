import Alert from '@material-ui/lab/Alert'
import React from 'react'
import { Container, makeStyles, Theme, createStyles, Collapse, IconButton } from '@material-ui/core'
import Helmet from 'react-helmet'
import { Trans } from 'react-i18next'
import CloseIcon from '@material-ui/icons/Close'
import { Keys as k } from '../translations/keys'
import { useSession } from '../session-context'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: 0,
      paddingTop: theme.spacing(2),
    },
    message: {
      backgroundColor: theme.palette.error.light,
      padding: theme.spacing(2),
    },
  }),
)

export default (): React.ReactElement => {
  const classes = useStyles()
  const { globalError, setGlobalError } = useSession()
  if (!globalError) return null
  const code = globalError.code
  const message = globalError.message
  return (
    <Container className={classes.root}>
      <Helmet>
        <title>{`${code}: ${message}`}</title>
        <meta name='description' content={`${code}: ${message}`} />
      </Helmet>
      <Collapse in={!!globalError}>
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
    </Container>
  )
}
