import React from 'react'
import { mainStyles } from '../theme'
import { OLink } from './Link'
import { OTable, OTableBody, OTableCell, OTableContainer, OTableHead, OTableRow } from './Table'

export default ({ clusters }): any => {
  const mainClasses = mainStyles()
  return (
    <div className='Cluster'>
      <h1>Clusters</h1>
      <OTableContainer>
        {/* <OTable className={classes.table} aria-label='simple table'> */}
        <OTable aria-label='simple table'>
          <OTableHead>
            <OTableRow>
              <OTableCell>Cluster</OTableCell>
              <OTableCell align='right'>Cloud</OTableCell>
              <OTableCell align='right'>Region</OTableCell>
              <OTableCell align='right'>Domain</OTableCell>
            </OTableRow>
          </OTableHead>
          <OTableBody>
            {clusters.map(row => (
              <OTableRow key={row.name}>
                <OTableCell component='th' scope='row' className={mainClasses.selectable}>
                  <a href={`https://otomi.${row.domain}`}>{row.cluster}</a>
                </OTableCell>
                <OTableCell align='right'>{row.cloud}</OTableCell>
                <OTableCell align='right'>{row.region}</OTableCell>
                <OTableCell align='right'>{row.domain}</OTableCell>
              </OTableRow>
            ))}
          </OTableBody>
        </OTable>
      </OTableContainer>
    </div>
  )
}
