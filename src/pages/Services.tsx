import { skipToken } from '@reduxjs/toolkit/dist/query'
import Services from 'components/Services'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAllServicesQuery, useGetTeamServicesQuery } from 'store/otomi'

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
    error: errorAllServices,
  } = useGetAllServicesQuery(teamId ? skipToken : undefined)
  const {
    data: teamServices,
    isLoading: isLoadingTeamServices,
    error: errorTeamServices,
  } = useGetTeamServicesQuery({ teamId }, { skip: !teamId })
  // END HOOKS
  const loading = isLoadingAllServices || isLoadingTeamServices
  const err = errorAllServices || errorTeamServices
  const services = teamId ? teamServices : allServices
  const comp = !(err || loading) && services && <Services services={services} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} />
}
