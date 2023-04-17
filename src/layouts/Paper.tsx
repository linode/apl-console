import { Card, Container } from '@mui/material'
import Error from 'components/Error'
import LoadingScreen from 'components/LoadingScreen'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import MainLayout from './Base'

const useStyles = makeStyles()((theme) => ({
  container: {
    paddingTop: 0,
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  paper: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    paddingTop: '1px',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
  title?: string
}

export default function ({ loading, comp, title }: Props): React.ReactElement {
  const { classes, cx } = useStyles()
  return (
    <MainLayout title={title}>
      <Container maxWidth='lg'>
        <Card sx={{ p: 3 }}>
          <Error />
          {loading && <LoadingScreen />}
          {!loading && comp}
        </Card>
      </Container>
    </MainLayout>
  )
}
