import React from 'react'
import { mainStyles } from '../theme'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'

interface Props {
  clusters: any[]
}

export default ({ clusters }: Props): any => {
  const mainClasses = mainStyles()
  return (
    <div className='Cluster'>
      <h1>Clusters</h1>
      <TableContainer>
        {/* <Table className={classes.table} aria-label='simple table'> */}
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
              <TableRow key={row.name}>
                <TableCell component='th' scope='row' className={mainClasses.selectable}>
                  <a href={`https://tomi.${row.domain}`}>{row.cluster}</a>
                </TableCell>
                <TableCell align='right'>{row.cloud}</TableCell>
                <TableCell align='right'>{row.region}</TableCell>
                <TableCell align='right'>{row.domain}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
