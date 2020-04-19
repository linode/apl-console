import React, { useContext } from 'react'
import { User } from './models'

let session

export interface SessionContext {
  isAdmin?: boolean
  user?: User
  oboTeamId?: string
  currentClusterId?: string
  clusters?: object
  setOboTeamId?: object
  setThemeType?: CallableFunction
}

export const SessionContext = React.createContext<SessionContext>({
  isAdmin: undefined,
  user: { teamId: undefined, email: undefined, name: undefined, isAdmin: undefined, role: undefined },
  oboTeamId: undefined,
  currentClusterId: undefined,
  clusters: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
})

export const useSession = (): any => {
  session = useContext(SessionContext)
  return session
}
