import React from 'react'
import { Container, makeStyles } from '@material-ui/core'
import MainLayout from './Base'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}))

export default ({ children }: any): React.ReactElement => {
  const classes = useStyles()
  return (
    <MainLayout>
      <Container className={classes.container}>{children}</Container>
    </MainLayout>
  )
}
