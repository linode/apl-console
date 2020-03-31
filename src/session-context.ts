import React, { useContext } from 'react'

let session

export interface SessionContext {
  initialising?: boolean
  isAdmin: boolean
  user?: object
  team?: object
  clusters?: object
  changeSession?: object
}

export const sessionContext = React.createContext<SessionContext>({
  initialising: true,
  isAdmin: undefined,
  user: undefined,
  team: undefined,
  clusters: undefined,
  changeSession: undefined,
})

export const useSession = (): any => {
  session = useContext(sessionContext)
  return session
}
