import React, { useContext } from 'react'

let session

export interface SessionContext {
  initialising?: boolean
  user?: object
  team?: object
  clusters?: object
}

export const sessionContext = React.createContext<SessionContext>({
  user: undefined,
  team: undefined,
  clusters: undefined,
})

export const useSession = (): any => {
  session = useContext(sessionContext)
  return session
}

export const getIsAdmin = (): boolean => {
  const { team } = session
  return team.name === 'admin'
}
