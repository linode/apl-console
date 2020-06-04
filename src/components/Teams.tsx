import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'
import RLink from './Link'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import MuiLink from './MuiLink'
import Cluster from '../models/Cluster'

interface Props {
  teams: any[]
}

export default ({ teams }: Props): any => {
  const {
    user: { isAdmin },
    currentClusterId,
    clusters,
  } = useSession()
  const [cloud, clusterName] = currentClusterId.split('/')
  const cluster: Cluster = find(clusters, { cloud, cluster: clusterName })
  const teamPrefix = 'team-' // @todo: get from values later
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Team Name',
      renderer: row => (isAdmin ? <RLink to={`/teams/${row.id}`}>{row.id}</RLink> : row.id),
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      renderer: row => {
        const { id } = row
        return (
          <MuiLink href={`https://apps.${teamPrefix}${id}.${cluster.domain}/otomi/`} target='_blank' rel='noopener'>
            {`apps.${teamPrefix}${id}.${cluster.domain}`}
          </MuiLink>
        )
      },
    },
    {
      id: 'clouds',
      label: 'Clouds',
      renderer: row => row.clusters.map(c => c.substr(0, c.indexOf('/'))).join(', '),
    },
    {
      id: 'id',
      label: 'Cluster',
      renderer: row => row.clusters.join(', '),
    },
  ]

  return (
    <>
      <h1>Teams</h1>
      {isAdmin && (
        <Box mb={1}>
          <Button
            component={Link}
            to='/create-team'
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            className='createTeam'
          >
            Create team
          </Button>
        </Box>
      )}
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={teams} idKey='teamId' />
    </>
  )
}
