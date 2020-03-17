import { useContext, useEffect, useState } from 'react'
import { useApi } from './hooks/api'
import { UserContext, userContext } from './user-context'

const testUser = { user: { email: 'testuser1@redkubes.com' }, team: 'otomi' }

export const useSession = (): UserContext => {
  const { user, team } = useContext(userContext)
  return { user, team }
}

export const getSession = (): [object, boolean, Error?] => {
  // return useApi('getSession')
  return [testUser, false]
}
