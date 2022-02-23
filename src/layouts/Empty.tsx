import React from 'react'
import { Container } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import MainLayout from './Base'

const useStyles = makeStyles()((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}))

export default function ({ children }: any): React.ReactElement {
  const { classes } = useStyles()
  return (
    <MainLayout>
      <Container className={classes.container}>{children}</Container>
    </MainLayout>
  )
}
