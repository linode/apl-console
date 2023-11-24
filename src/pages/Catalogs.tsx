/* eslint-disable @typescript-eslint/no-floating-promises */
import Catalogs from 'components/Catalogs'
import MainLayout from 'layouts/Empty'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  return (
    <MainLayout title='Developer Catalog'>
      <Catalogs teamId={teamId} />
    </MainLayout>
  )
}
