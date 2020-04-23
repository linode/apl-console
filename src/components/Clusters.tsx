import { Link } from '@material-ui/core'
import React from 'react'
import RLink from './Link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'

interface Props {
  clusters: any[]
}

export default ({ clusters }: Props): any => {
  return (
    <div className='Cluster'>
      <h1>Clusters</h1>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Domain</TableCell>
              <TableCell align='right'>Cloud</TableCell>
              <TableCell align='right'>Region</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusters.map(row => {
              const teamPrefix = 'team-' // @todo: get from values later
              return (
                <TableRow key={row.domain}>
                  <TableCell component='th' scope='row'>
                    <RLink to={`/cluster/${encodeURIComponent(row.id)}`}>{row.id}</RLink>
                  </TableCell>
                  <TableCell align='right'>
                    <Link href={`https://otomi.${teamPrefix}admin.${row.domain}`}>{row.domain}</Link>
                  </TableCell>
                  <TableCell align='right'>{row.cloud}</TableCell>
                  <TableCell align='right'>{row.region}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
