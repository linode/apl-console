import React from 'react'
import Dashboard from '../components/Dashboard'
import Loader from '../components/Loader'
import { getSchema, useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'

export default (): any => {
  const { isAdmin, team } = useSession()
  return (
    <MainLayout>
      <Dashboard teamId={team.name} />
    </MainLayout>
  )
}
