import { Card, Container } from '@mui/material'
import Error from 'components/Error'
import MainLayout from 'layouts/Base'
import React from 'react'
import { HttpError } from 'utils/error'

interface Props {
  error?: HttpError
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
