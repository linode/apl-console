import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Button } from '@mui/material'
import { Job, Team } from '@redkubes/otomi-api-client-axios'
import { useSession } from 'common/session-context'
import React from 'react'
import { Link } from 'react-router-dom'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'

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
  jobs: Job[]
  team?: Team
}

export default function ({ jobs, team }: Props): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const showTeam = !team
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Job Name',
      renderer: getJobLink(isAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: 'Type',
    },
    {
      id: 'runPolicy',
      label: 'Run Policy',
    },
    {
      id: 'schedule',
      label: 'Schedule',
    },
  ]
  if (showTeam) {
    headCells.push({
      id: 'teamId',
      label: 'Team',
    })
  }

  return (
    <>
      <h1 data-cy='h1-jobs-page'>{!team ? 'Jobs' : `Jobs (team ${team.id})`}</h1>
      <Box mb={1}>
        {(isAdmin || oboTeamId) && (
          <Button
            component={Link}
            to={isAdmin && !oboTeamId ? '/create-job' : `/teams/${oboTeamId}/create-job`}
            startIcon={<AddCircleIcon />}
            disabled={isAdmin && !oboTeamId}
            data-cy='button-create-job'
          >
            Create job
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={jobs} idKey='id' />
    </>
  )
}
