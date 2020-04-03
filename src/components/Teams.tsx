import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { useSession } from '../session-context'
import { OLink } from './Link'
import { OTable, OTableBody, OTableCell, OTableContainer, OTableHead, OTableRow } from './Table'

const TeamActionBar = (): any => {
  return (
    <Box mb={1}>
      <Button
        component={OLink}
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
      <h1>Teams</h1>
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
                  <OLink to={`/teams/${row.name}`}>{row.name}</OLink>
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
