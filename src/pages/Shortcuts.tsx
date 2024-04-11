import Forbidden from 'components/Forbidden'
import Shortcuts from 'components/Shortcuts'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { GetAppsApiResponse, useGetAppsQuery } from 'redux/otomiApi'
import { getAppData, getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const authzSession = useAuthzSession(teamId)
  if (!authzSession) return <PaperLayout comp={<Forbidden />} />
  const { data: apps, isLoading } = useGetAppsQuery({ teamId })
  const { t } = useTranslation()
  // END HOOKS
  const appsWithShortcuts = (apps || [])
    .map((app) => getAppData(authzSession, teamId, app, true))
    .filter((a) => a.shortcuts?.length)
    .reduce((memo, app) => {
      // flatten
      app.shortcuts.forEach((s) => memo.push({ ...app, shortcut: s, description: s.description }))
      return memo
    }, [])
  const comp = apps && <Shortcuts teamId={teamId} apps={appsWithShortcuts as GetAppsApiResponse} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SHORTCUTS', { role: getRole(teamId) })} />
}
