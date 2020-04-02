import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'

export default ({ clusters }): any => {
  return (
    <div className='Cluster'>
      <h2>Clusters</h2>
      <TableContainer component={Paper}>
        {/* <Table className={classes.table} aria-label='simple table'> */}
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Cluster</TableCell>
              <TableCell align='right'>Cloud</TableCell>
              <TableCell align='right'>Domain</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusters.map(row => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row'>
                  {row.cluster}
                </TableCell>
                <TableCell align='right'>{row.cloud}</TableCell>
                <TableCell align='right'>{row.domain}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
