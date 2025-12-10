import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import InformationBanner from 'components/InformationBanner'
import ListTable from 'components/ListTable'
import { Status, getStatus } from 'utils/status'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllBuildsQuery, useGetTeamBuildsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import { Box } from '@mui/material'
import { useSocket } from 'providers/Socket'
import RLink from '../../../components/Link'
import CopyToClipboard from '../../../components/CopyToClipboard'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  imageName: string
  trigger: boolean
  mode: { type: string }
}

const getBuildLink = (row: Row) => {
  const path = `/teams/${row.teamId}/container-images/${encodeURIComponent(row.name)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

const getTektonTaskRunLink = (row: Row, domainSuffix: string) => {
  const path = `/#/namespaces/team-${row.teamId}/pipelineruns/${row.mode.type}-build-${row.name}`
  const triggerPath = `/#/namespaces/team-${row.teamId}/pipelineruns/`
  const host = `https://tekton-${row.teamId}.${domainSuffix}`
  const externalUrl = `${host}/${path}`
  const externalUrlTrigger = `${host}/${triggerPath}`

  if (row.trigger) {
    return (
      <Link to={{ pathname: externalUrlTrigger }} target='_blank'>
        PipelineRun
      </Link>
    )
  }

  return (
    <Link to={{ pathname: externalUrl }} target='_blank'>
      PipelineRun
    </Link>
  )
}

function RepositoryRenderer({ row, domainSuffix }: { row: Row; domainSuffix: string }) {
  const repository = `harbor.${domainSuffix}/team-${row.teamId}/${row.imageName}`
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link to={{ pathname: repository }} target='_blank' />
      <CopyToClipboard text={repository} />
    </Box>
  )
}

interface Params {
  teamId?: string
}

export default function BuildsOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const {
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const { statuses } = useSocket()
  const {
    data: allBuilds,
    isLoading: isLoadingAllBuilds,
    isFetching: isFetchingAllBuilds,
    refetch: refetchAllBuilds,
  } = useGetAllBuildsQuery(teamId ? skipToken : undefined)
  const {
    data: teamBuilds,
    isLoading: isLoadingTeamBuilds,
    isFetching: isFetchingTeamBuilds,
    refetch: refetchTeamBuilds,
  } = useGetTeamBuildsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllBuilds) refetchAllBuilds()
    else if (teamId && !isFetchingTeamBuilds) refetchTeamBuilds()
  }, [isDirty])
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getBuildLink(row),
    },
    {
      id: 'mode',
      label: t('Type'),
      renderer: (row) => row.mode.type,
    },
    {
      id: 'tekton',
      label: t('Tekton'),
      renderer: (row: Row) => getTektonTaskRunLink(row, domainSuffix),
    },
    {
      id: 'harbor',
      label: t('Repository'),
      renderer: (row: Row) => <RepositoryRenderer row={row} domainSuffix={domainSuffix} />,
    },
    {
      id: 'tag',
      label: t('Tag'),
      renderer: (row) => row.tag,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row: Row) => getStatus((statuses?.builds?.[row.name] as Status) || 'NotFound'),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  const customButtonText = () => <span>Create container image</span>

  const loading = isLoadingAllBuilds || isLoadingTeamBuilds
  const builds = teamId ? teamBuilds : allBuilds

  const comp = !appsEnabled.harbor ? (
    <InformationBanner message='Admin needs to enable the Harbor app to activate this feature.' />
  ) : (
    builds && (
      <ListTable
        teamId={teamId}
        headCells={headCells}
        rows={builds}
        resourceType='Container-image'
        customButtonText={customButtonText()}
      />
    )
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_CONTAINER_IMAGES', { scope: getRole(teamId) })} />
}
