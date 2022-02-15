import React from 'react'
import { Container } from '@material-ui/core'
import { Theme } from '@mui/material'
import { makeStyles } from 'common/theme'
import MainLayout from './Base'

const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}))

export default ({ children }: any): React.ReactElement => {
  const { classes } = useStyles()
  return (
    <MainLayout>
      <Container className={classes.container}>{children}</Container>
    </MainLayout>
  )
}
