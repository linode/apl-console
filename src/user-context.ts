import * as React from 'react'

interface UserContext {
  initialising?: boolean
  user?: firebase.User
}

export const userContext = React.createContext<UserContext>({
  user: undefined,
})
