import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'
import { useGetAplAgentsQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { Status, getStatus } from 'utils/status'
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

const getFoundationModel = (): CallableFunction =>
  function (row: any): string {
    const { foundationModel } = row
    return foundationModel || 'N/A'
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
      foundationModel: agent.spec.foundationModel,
    })) || []

  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getAgentName(),
    },
    {
      id: 'foundationModel',
      label: t('Foundation Model'),
      renderer: getFoundationModel(),
    },
    {
      id: 'status',
      label: t('Status'),
      renderer: (row: any) => getStatus((row.status?.phase as Status) || 'Unknown'),
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
