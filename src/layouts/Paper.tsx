import { Card, Container, useTheme } from '@mui/material'
import Error from 'components/Error'
import LoadingScreen from 'components/LoadingScreen'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { useLocation } from 'react-router-dom'
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
  comp?: React.ReactElement
  title?: string
  children?: any
}

export default function ({ loading, comp, title, children }: Props): React.ReactElement {
  const { classes, cx } = useStyles()
  const theme = useTheme()
  const location = useLocation()
  // grafana iframe background color
  const dashboardStyle =
    location.pathname === '/' ? { backgroundColor: 'background.contrast' } : { backgroundColor: 'transparent' }
  return (
    <MainLayout title={title}>
      <Container maxWidth='lg'>
        <Card sx={{ ...dashboardStyle }}>
          <Error />
          {loading && <LoadingScreen />}
          {!loading && comp}
          {children}
        </Card>
      </Container>
    </MainLayout>
  )
}
