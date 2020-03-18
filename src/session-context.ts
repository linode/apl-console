import React, { useContext } from 'react'

export interface SessionContext {
  initialising?: boolean
  user?: object
  team?: object
}

export const sessionContext = React.createContext<SessionContext>({
  user: undefined,
  team: undefined,
})

export const useSession = (): any => {
  const session = useContext(sessionContext)
  return session
}
