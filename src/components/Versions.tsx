import { Chip, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { map } from 'lodash'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import LinkCommit from './LinkCommit'

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
  const {
    settings: {
      cluster: { domainSuffix, k8sVersion },
    },
    versions,
  } = useSession()
  const { classes } = useStyles()
  const { t } = useTranslation()
  // END HOOKS
  // TODO: create from git config, which is now in otomi-api values. Move?
  const clusterLegend = {
    [t('Kubernetes')]: k8sVersion,
    [t('Otomi Core')]: versions.core,
    [t('Otomi API')]: versions.api,
    [t('Otomi Console')]: versions.console,
    [t('Otomi Values')]: <LinkCommit domainSuffix={domainSuffix} sha={versions.values} color='primary' short />,
  }
  return (
    <TableContainer sx={{ pt: 3, mt: 4, borderTop: '1px solid grey' }}>
      <Table size='small' aria-label='simple table' sx={{ display: 'flex' }}>
        {map(clusterLegend, (v, title) => (
          <TableBody key={title}>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableCellLeft} component='th' scope='row' align='right'>
                <Chip size='small' label={title} />
              </TableCell>
              <TableCell className={classes.tableCellRight} align='left'>
                {v}
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>
    </TableContainer>
  )
}
