import * as React from 'react'

export interface UserContext {
  initialising?: boolean
  user?: object
  team?: string
}

export const userContext = React.createContext<UserContext>({
  user: undefined,
  team: undefined,
})
