import { SessionContext, useSession } from 'providers/Session'
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'

export default (teamId?: string): SessionContext => {
  const session: SessionContext = useSession()
  const dispatch = useAppDispatch()
  const {
    user: { isAdmin },
    oboTeamId,
  } = session
  if (!isAdmin && teamId && teamId !== oboTeamId) {
    const error = {
      code: 403,
      message: 'Forbidden',
      status: 403,
    }
    dispatch(setError(error))
    return null
  }

  return session
}
