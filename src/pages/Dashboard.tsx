import React from 'react'
import Dashboard from '../components/Dashboard'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'

export default (): any => {
  const { teamId } = useSession()
  return (
    <MainLayout>
      <Dashboard teamId={teamId} />
    </MainLayout>
  )
}
