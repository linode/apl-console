import { Card, Container } from '@mui/material'
import Error from 'components/Error'
import MainLayout from 'layouts/Base'
import React from 'react'
import { ApiError } from 'utils/error'

interface Props {
  error?: ApiError
}

export default function ({ error }: Props): React.ReactElement {
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
