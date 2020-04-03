import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'
import { OTable, OTableBody, OTableCell, OTableContainer, OTableHead, OTableRow } from './Table'

const getTeamLink = (row): any => {
  return <Link to={`/teams/${row.name}`}>{row.name}</Link>
}

const TeamActionBar = (): any => {
  return (
    <Box mb={1}>
      <Button
        component={Link}
        to='/create-team'
        startIcon={<AddCircleIcon />}
        variant='contained'
        color='primary'
        className={'createTeam'}
      >
        Create team
      </Button>
    </Box>
  )
}

export default ({ teams }): any => {
  const { isAdmin } = useSession()

  return (
    <div className='Teams'>
      <h2>Teams</h2>
      {isAdmin && <TeamActionBar />}
      <OTableContainer>
        {/* <OTable className={classes.table} aria-label='simple table'> */}
        <OTable aria-label='simple table'>
          <OTableHead>
            <OTableRow>
              <OTableCell>Team Name</OTableCell>
              <OTableCell align='right'>Clusters</OTableCell>
            </OTableRow>
          </OTableHead>
          <OTableBody>
            {teams.map(row => (
              <OTableRow key={row.name}>
                <OTableCell component='th' scope='row' id={row.teamId}>
                  {getTeamLink(row)}
                </OTableCell>
                <OTableCell align='right'>{row.clusters.join(', ')}</OTableCell>
              </OTableRow>
            ))}
          </OTableBody>
        </OTable>
      </OTableContainer>
    </div>
  )
}
