import React from 'react'
import { Container, Grid, Paper, makeStyles } from '@material-ui/core'
import MainLayout from './Base'
import { Error, Loader } from '../components'
import { ApiError } from '../utils/error'

const useStyles = makeStyles(theme => ({
  container: {
    // paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  // paper: {
  //   padding: theme.spacing(2),
  //   display: 'flex',
  //   overflow: 'auto',
  //   flexDirection: 'column',
  // },
}))

interface Props {
  err?: ApiError
  loading?: boolean
  comp: React.ReactElement
}
export default ({ err, loading, comp }: Props) => {
  const classes = useStyles()
  return (
    <MainLayout>
      <Container maxWidth='lg' className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} component={Paper}>
            {(err && <Error msg={err.message} code={err.code} />) || (loading && <Loader />) || comp}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  )
}
