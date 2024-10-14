import { SessionContext, useSession } from 'providers/Session'

export default (teamId?: string): SessionContext => {
  const session: SessionContext = useSession()
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = session
  if (!isPlatformAdmin && teamId && teamId !== oboTeamId) return undefined
  return session
}
