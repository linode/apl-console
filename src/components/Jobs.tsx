import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetAllJobsApiResponse, GetTeamJobsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

const getJobLink = (isAdmin, ownerId): CallableFunction =>
  function (row): React.ReactElement {
    const { teamId, id, name } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path = `/teams/${teamId}/jobs/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

interface Props {
  jobs: GetAllJobsApiResponse | GetTeamJobsApiResponse
  teamId?: string
}

export default function ({ jobs, teamId }: Props): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Job name'),
      renderer: getJobLink(isAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: t('Type'),
    },
    {
      id: 'runPolicy',
      label: t('Run policy'),
    },
    {
      id: 'schedule',
      label: t('Schedule'),
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={jobs} idKey='id' resourceType='Job' />
}
