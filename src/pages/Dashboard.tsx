import React from 'react'
import Dashboard from '../components/Dashboard'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'

export default (): any => {
  const { team } = useSession()
  return (
    <MainLayout>
      <Dashboard teamId={team.name} />
    </MainLayout>
  )
}
