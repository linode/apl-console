import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetTeamBuildsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  mode: { type: string }
}

const getBuildLink = (row: Row) => {
  const path = `/teams/${row.teamId}/builds/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

const getTektonTaskRunLink = (row: Row, domainSuffix: string) => {
  const app = `team-${row.teamId}-${row.name}`
  const path = `/#/namespaces/team-${row.teamId}/pipelineruns/${row.mode}-build-${row.teamId}-${row.tag}`
  const host = `https://tekton-${row.teamId}.${domainSuffix}`
  const externalUrl = `${host}/${path}`

  return (
    <Link to={{ pathname: externalUrl }} target='_blank'>
      PipelineRun
    </Link>
  )
}

interface Props {
  builds: GetTeamBuildsApiResponse
  teamId?: string
}

export default function ({ builds, teamId }: Props): React.ReactElement {
  // const {
  //   oboTeamId,
  //   user: { isAdmin },
  // } = useSession()
  const {
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()

  const { t } = useTranslation()
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
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.tekton || !appsEnabled.harbor)
    return <p>Admin needs to enable the Tekton and Harbor apps to activate this feature.</p>

  return <ListTable teamId={teamId} headCells={headCells} rows={builds} resourceType='Build' />
}
