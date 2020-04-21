import React from 'react'
import { Container, Grid, Paper, makeStyles } from '@material-ui/core'
import MainLayout from './Base'

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

export default ({ children }: any): any => {
  const classes = useStyles()
  return (
    <MainLayout>
      <Container maxWidth='lg' className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} component={Paper}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  )
}
