import { SessionContext, useSession } from 'providers/Session'
import { ApiErrorUnauthorized } from 'utils/error'

export default (teamId?: string): SessionContext => {
  const session: SessionContext = useSession()
  const {
    user: { isAdmin },
    oboTeamId,
  } = session
  if (!isAdmin && teamId && teamId !== oboTeamId) throw new ApiErrorUnauthorized()

  return session
}
