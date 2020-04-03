import React from 'react'
import { OTable, OTableBody, OTableCell, OTableContainer, OTableHead, OTableRow } from './Table'

export default ({ clusters }): any => {
  return (
    <div className='Cluster'>
      <h2>Clusters</h2>
      <OTableContainer>
        {/* <OTable className={classes.table} aria-label='simple table'> */}
        <OTable aria-label='simple table'>
          <OTableHead>
            <OTableRow>
              <OTableCell>Cluster</OTableCell>
              <OTableCell align='right'>Cloud</OTableCell>
              <OTableCell align='right'>Domain</OTableCell>
            </OTableRow>
          </OTableHead>
          <OTableBody>
            {clusters.map(row => (
              <OTableRow key={row.name}>
                <OTableCell component='th' scope='row'>
                  {row.cluster}
                </OTableCell>
                <OTableCell align='right'>{row.cloud}</OTableCell>
                <OTableCell align='right'>{row.domain}</OTableCell>
              </OTableRow>
            ))}
          </OTableBody>
        </OTable>
      </OTableContainer>
    </div>
  )
}
