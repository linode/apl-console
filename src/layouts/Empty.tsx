import { Container } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import MainLayout from './Base'

const useStyles = makeStyles()(() => ({
  container: {
    padding: 0,
  },
}))

interface Props {
  children?: any
  title?: string
}

export default function ({ children, title }: Props): React.ReactElement {
  const { classes } = useStyles()
  return (
    <MainLayout title={title}>
      <Container className={classes.container}>{children}</Container>
    </MainLayout>
  )
}
