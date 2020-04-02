import React, { useContext } from 'react'

let session

export interface SessionContext {
  initialising?: boolean
  isAdmin: boolean
  user?: object
  teamId?: string
  clusters?: object
  changeSession?: object
}

export const sessionContext = React.createContext<SessionContext>({
  initialising: true,
  isAdmin: undefined,
  user: undefined,
  teamId: undefined,
  clusters: undefined,
  changeSession: undefined,
})

export const useSession = (): any => {
  session = useContext(sessionContext)
  return session
}
