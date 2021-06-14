import React from 'react'
import { Container, Grid, Paper, makeStyles } from '@material-ui/core'
import MainLayout from './Base'
import Error from '../components/Error'
import Loader from '../components/Loader'

const useStyles = makeStyles((theme) => ({
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
  loading?: boolean
  comp: React.ReactElement
}
export default ({ loading, comp }: Props): React.ReactElement => {
  const classes = useStyles()
  return (
    <MainLayout>
      <Container maxWidth='lg' className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} component={Paper}>
            <Error />
            {loading && <Loader />}
            {!loading && comp}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  )
}
