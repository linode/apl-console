import * as React from 'react'

interface UserContext {
  initialising?: boolean
  user?: object
}

export const userContext = React.createContext<UserContext>({
  user: undefined,
})
