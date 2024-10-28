import { Box, Card, Container } from '@mui/material'
import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Error from 'components/Error'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
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
  const dispatch = useAppDispatch()
  const error = useAppSelector(({ global: { error } }) => error)
  useEffect(() => {
    return () => {
      if (error && error.status === 409) dispatch(setError(undefined))
    }
  }, [error])
  return (
    <MainLayout title={title}>
      <Container maxWidth='lg'>
        <Card sx={{ ...dashboardStyle }}>
          <Error />
          {loading && <LoadingScreen />}
          <Box sx={{ display: error && 'none' }}>
            {!loading && comp}
            {children}
          </Box>
        </Card>
      </Container>
    </MainLayout>
  )
}
