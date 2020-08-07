import React, { useState } from 'react'
import Context, { SessionContext } from './session-context'
import { useLocalStorage } from './hooks/useLocalStorage'
import { setThemeType, setThemeName } from './theme'

interface Props {
  session: SessionContext
  children: React.ReactNode
}
export default function SessionProvider({ session, children }: Props) {
  const { user } = session
  const [themeType, setType] = useLocalStorage('themeType', 'light')
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const [teams, setTeams] = useState(session.teams)
  setThemeName(user.isAdmin ? 'admin' : 'team')
  setThemeType(themeType)
  if (!user.isAdmin && !oboTeamId) {
    setOboTeamId(user.teams[0])
  }

  const context = {
    ...session,
    oboTeamId,
    setOboTeamId,
    themeType,
    setThemeType: setType,
    teams,
    setTeams,
  }

  return <Context.Provider value={context}>{children}</Context.Provider>
}
