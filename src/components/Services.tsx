import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { OLink } from './Link'
import { OTable, OTableBody, OTableCell, OTableContainer, OTableHead, OTableRow } from './Table'

const getServiceLink = (row): any => {
  const link = `/teams/${row.teamId}/services/${row.name}`
  return <OLink to={link}>{row.name}</OLink>
}

// const getPublicUrl = (row): any => {
//   if (isEmpty(row.ingress)) {
//     return '-'
//   }
//   return `${row.ingress.domain}`
// }

export default ({ services, teamId }): any => {
  return (
    <div className='Services'>
      <h1>Services</h1>
      <Box mb={1}>
        <Button
          component={OLink}
          to={`/teams/${teamId}/create-service`}
          startIcon={<AddCircleIcon />}
          variant='contained'
          color='primary'
          disabled={!teamId}
        >
          Create service
        </Button>
      </Box>
      <OTableContainer>
        <OTable aria-label='simple table'>
          <OTableHead>
            <OTableRow>
              <OTableCell>Service Name</OTableCell>
              <OTableCell align='right'>Cluster</OTableCell>
              {!teamId && <OTableCell align='right'>Team</OTableCell>}
            </OTableRow>
          </OTableHead>
          <OTableBody>
            {services.map(row => (
              <OTableRow key={row.name}>
                <OTableCell component='th' scope='row'>
                  {getServiceLink(row)}
                </OTableCell>
                <OTableCell align='right'>{row.clusterId}</OTableCell>
                {!teamId && <OTableCell align='right'>{row.teamId}</OTableCell>}
              </OTableRow>
            ))}
          </OTableBody>
        </OTable>
      </OTableContainer>
    </div>
  )
}
