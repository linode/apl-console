import React from 'react'
import { Container, makeStyles, Theme, createStyles } from '@material-ui/core'
import Helmet from 'react-helmet'

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

interface Props {
  code: number
  message?: string
}

export default (props: Props): React.ReactElement => {
  const classes = useStyles()
  const { code, message } = props
  return (
    <Container className={classes.root}>
      <Helmet>
        <title>{`${code}: ${message}`}</title>
        <meta name='description' content={`${code}: ${message}`} />
      </Helmet>
      <div>{`${message}`}</div>
    </Container>
  )
}
