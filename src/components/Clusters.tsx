import { Link } from '@material-ui/core'
import React from 'react'
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
              <TableCell>Domain</TableCell>
              <TableCell align='right'>Cloud</TableCell>
              <TableCell align='right'>Region</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusters.map(row => (
              <TableRow key={row.domain}>
                <TableCell component='th' scope='row'>
                  <Link href={`https://otomi.${row.domain}`}>{row.domain}</Link>
                </TableCell>
                <TableCell align='right'>{row.cloud}</TableCell>
                <TableCell align='right'>{row.region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
