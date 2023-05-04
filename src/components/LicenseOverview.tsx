import { Chip, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { map } from 'lodash'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  listItem: {
    height: theme.spacing(3),
  },
  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 },
  },
  tableCellLeft: {
    paddingLeft: 0,
  },
  tableCellRight: {
    paddingLeft: 0,
  },
}))

export default function (): React.ReactElement {
  const { license } = useSession()
  const { classes } = useStyles()
  const { t } = useTranslation()
  // END HOOKS
  const LicenseLegend = {
    [t('License Type')]: license.body?.type,
    [t('Team Capabilities')]: license.body?.capabilities.teams,
    [t('Workload Capabilities')]: license.body?.capabilities.workloads,
    [t('Service Capabilities')]: license.body?.capabilities.services,
  }
  return (
    <TableContainer sx={{ pt: 3, mt: 4, borderTop: '1px solid grey' }}>
      <Table
        size='small'
        aria-label='simple table'
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        {map(LicenseLegend, (v, title) => (
          <TableBody key={title}>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCellLeft} component='th' scope='row' align='right'>
                <Chip size='small' label={title} />
              </TableCell>
              <TableCell className={classes.tableCellRight} align='center'>
                {v}
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </TableContainer>
  )
}
