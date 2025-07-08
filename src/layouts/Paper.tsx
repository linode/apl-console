import { Box, Card, Container } from '@mui/material'
import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Error from 'components/Error'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import ObjWizardModal from 'components/ObjWizardModal'
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
  const dashboardStyle =
    location.pathname === '/' ? { backgroundColor: 'background.contrast' } : { backgroundColor: 'transparent' }
  const dispatch = useAppDispatch()
  const globalError = useAppSelector(({ global: { error } }) => error)
  useEffect(() => {
    // clear global error when pathname changes to prevent the error from reappearing
    if (globalError) dispatch(setError(undefined))
  }, [location.pathname])
  return (
    <MainLayout title={title}>
      <Container maxWidth='lg'>
        <Card sx={{ ...dashboardStyle }}>
          <Error />
          {loading && !globalError && <LoadingScreen />}
          <Box sx={{ display: globalError && 'none' }}>
            {!loading && comp}
            {children}
          </Box>
        </Card>
      </Container>
      <ObjWizardModal />
    </MainLayout>
  )
}
