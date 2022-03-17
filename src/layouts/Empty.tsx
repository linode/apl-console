import { Container } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import MainLayout from './Base'

const useStyles = makeStyles()((theme) => ({
  container: {
    padding: 0,
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
