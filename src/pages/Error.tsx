import { Card, Container } from '@mui/material'
import Error from 'components/Error'
import MainLayout from 'layouts/Base'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { HttpError } from 'utils/error'

interface Props {
  error?: HttpError
}

export default function ({ error }: Props): React.ReactElement {
  const [prevPath, setPrevPath] = useState<string | undefined>(undefined)
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) setPrevPath(location.pathname)
  }, [error])

  useEffect(() => {
    // clear the error when navigating to a different page
    // reload the page to prevent the error from reappearing
    if (prevPath && prevPath !== location.pathname) {
      dispatch(setError(undefined))
      window.location.reload()
    }
  }, [location.pathname])

  return (
    <MainLayout title='Error Boundary'>
      <Container maxWidth='lg'>
        <Card>
          <Error error={error} />
        </Card>
      </Container>
    </MainLayout>
  )
}
