import { SessionContext, useSession } from 'providers/Session'

export default (teamId?: string): SessionContext => {
  const session: SessionContext = useSession()
  const {
    user: { isAdmin },
    oboTeamId,
  } = session
  if (!isAdmin && teamId && teamId !== oboTeamId) return undefined
  return session
}
