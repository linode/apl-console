import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'
import { useGetAplAgentsQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

const getAgentName = (): CallableFunction =>
  function (row: any): string | React.ReactElement {
    const { teamId, name }: { teamId: string; name: string } = row
    const path = `/teams/${teamId}/agents/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

const getStatus = (): CallableFunction =>
  function (row: any): string {
    const { status } = row
    return status?.phase || 'Unknown'
  }

const getRegion = (): CallableFunction =>
  function (row: any): string {
    const { region } = row
    return region || 'N/A'
  }

const getExposure = (): CallableFunction =>
  function (row: any): string {
    const { exposure } = row
    return exposure || 'N/A'
  }

interface Params {
  teamId: string
}

export default function AgentsOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()

  const { data: agents, isLoading, isFetching, refetch } = useGetAplAgentsQuery({ teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  // Transform API response to match table format
  const transformedData =
    agents?.map((agent) => ({
      name: agent.metadata.name,
      teamId,
      status: agent.status,
      region: 'dummy region', // Replace with actual region if available in the API response
      exposure: 'dummy exposure', // Replace with actual exposure if available in the API response
    })) || []

  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getAgentName(),
    },
    {
      id: 'status',
      label: t('Status'),
      renderer: getStatus(),
    },
    {
      id: 'region',
      label: t('Region'),
      renderer: getRegion(),
    },
    {
      id: 'exposure',
      label: t('Exposure'),
      renderer: getExposure(),
    },
  ]

  const customButtonText = () => <span>Create Agent</span>

  const comp = (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={transformedData}
      resourceType='Agent'
      customButtonText={customButtonText()}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_AGENTS', { scope: getRole(teamId) })} />
}
