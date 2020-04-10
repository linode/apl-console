import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'
import { Link } from './Link'

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
              <TableCell>Cluster</TableCell>
              <TableCell align='right'>Cloud</TableCell>
              <TableCell align='right'>Region</TableCell>
              <TableCell align='right'>Domain</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusters.map(row => (
              <TableRow key={row.domain}>
                <TableCell component='th' scope='row'>
                  {row.cluster}
                </TableCell>
                <TableCell align='right'>{row.cloud}</TableCell>
                <TableCell align='right'>{row.region}</TableCell>
                <TableCell align='right'>
                  <Link href={`https://otomi.${row.domain}`}>{row.domain}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
