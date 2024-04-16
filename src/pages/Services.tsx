import { skipToken } from '@reduxjs/toolkit/dist/query'
import Services from 'components/Services'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllServicesQuery, useGetMetricsQuery, useGetTeamServicesQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import { canCreateAdditionalResource } from 'utils/permission'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allServices,
    isLoading: isLoadingAllServices,
    isFetching: isFetchingAllServices,
    refetch: refetchAllServices,
  } = useGetAllServicesQuery(teamId ? skipToken : undefined)
  const {
    data: teamServices,
    isLoading: isLoadingTeamServices,
    isFetching: isFetchingTeamServices,
    refetch: refetchTeamServices,
  } = useGetTeamServicesQuery({ teamId }, { skip: !teamId })
  const { data: metrics, isLoading: isLoadingMetrics } = useGetMetricsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllServices) refetchAllServices()
    else if (teamId && !isFetchingTeamServices) refetchTeamServices()
  }, [isDirty])
  const { license } = useSession()
  const { t } = useTranslation()
  // END HOOKS

  const loading = isLoadingAllServices || isLoadingTeamServices || isLoadingMetrics
  const services = teamId ? teamServices : allServices
  const comp = services && (
    <Services
      services={services}
      teamId={teamId}
      canCreateResource={canCreateAdditionalResource('service', metrics, license)}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SERVICES', { scope: getRole(teamId) })} />
}
