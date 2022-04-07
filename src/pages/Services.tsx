import { skipToken } from '@reduxjs/toolkit/dist/query'
import Services from 'components/Services'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAllServicesQuery, useGetTeamServicesQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { data: allServices, isLoading: isLoadingAllServices } = useGetAllServicesQuery(teamId ? skipToken : undefined)
  const { data: teamServices, isLoading: isLoadingTeamServices } = useGetTeamServicesQuery(
    { teamId },
    { skip: !teamId },
  )
  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllServices || isLoadingTeamServices
  const services = teamId ? teamServices : allServices
  const comp = services && <Services services={services} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SERVICES', { scope: getRole(teamId) })} />
}
