import { Box, Card, Container } from '@mui/material'
import LoadingScreen from 'components/LoadingScreen'
import React from 'react'
import { useLocation } from 'react-router-dom'
import Error from 'components/Error'
import { useAppSelector } from 'redux/hooks'
import MainLayout from './Base'

interface Props {
  loading?: boolean
  comp?: React.ReactElement
  title?: string
  children?: any
}

export default function ({ loading, comp, title, children }: Props): React.ReactElement {
  const location = useLocation()
  // grafana iframe background color
  const dashboardStyle = location.pathname === '/' ? { backgroundColor: 'background.contrast' } : {}
  const isError = useAppSelector(({ global: { error } }) => error)
  return (
    <MainLayout title={title}>
      <Container maxWidth='lg'>
        <Card sx={{ ...dashboardStyle }}>
          <Error />
          {loading && <LoadingScreen />}
          <Box sx={{ display: isError && 'none' }}>
            {!loading && comp}
            {children}
          </Box>
        </Card>
      </Container>
    </MainLayout>
  )
}
