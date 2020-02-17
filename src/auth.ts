import { useContext } from 'react'
import { userContext } from './user-context'

export const useSession = (): object => {
  const { user } = useContext(userContext)
  return user
}
