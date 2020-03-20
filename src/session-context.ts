import React, { useContext } from 'react'

let session

export interface SessionContext {
  initialising?: boolean
  isAdmin: boolean
  user?: object
  team?: object
  clusters?: object
}

export const sessionContext = React.createContext<SessionContext>({
  isAdmin: undefined,
  user: undefined,
  team: undefined,
  clusters: undefined,
})

export const useSession = (): any => {
  session = useContext(sessionContext)
  return session
}
