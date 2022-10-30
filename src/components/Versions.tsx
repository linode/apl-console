import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import {
  Chip,
  Link,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { useMainStyles } from 'common/theme'
import generateDownloadLink from 'generate-download-link'
import { map } from 'lodash'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { getCommitLink } from 'utils/data'

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

function StyledMenuItem(props: any) {
  const { classes: mainClasses } = useMainStyles()
  return <MenuItem className={mainClasses.selectable} {...props} />
}

export default function (): React.ReactElement {
  const {
    ca,
    settings: {
      cluster: { domainSuffix, k8sVersion },
    },
    versions,
  } = useSession()
  const { classes: mainClasses } = useMainStyles()
  const { classes } = useStyles()
  const { t } = useTranslation()
  // END HOOKS
  // TODO: create from git config, which is now in otomi-api values. Move?
  const gitHost = `https://gitea.${domainSuffix}/otomi/values.git`
  const clusterLegend = {
    [t('Kubernetes')]: k8sVersion,
    [t('Otomi Core')]: versions.core,
    [t('Otomi API')]: versions.api,
    [t('Otomi Console')]: versions.console,
    [t('Deployed Values')]: (
      <Link
        href={getCommitLink(versions.values.deployed, gitHost)}
        target='_blank'
        rel='noopener'
        title={t(`Follow to view commit`)}
      >
        {versions.values.deployed?.substring(0, 8)}
      </Link>
    ),
    [t('Console Values')]: (
      <Link
        href={getCommitLink(versions.values.console, gitHost)}
        target='_blank'
        rel='noopener'
        title={t(`Follow to view commit`)}
      >
        {versions.values.console?.substring(0, 8)}
      </Link>
    ),
  }
  const downloadOpts = {
    data: ca ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = ca ? generateDownloadLink(downloadOpts) : ''
  return (
    <List dense>
      <TableContainer>
        <Table size='small' aria-label='simple table'>
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

      {ca && (
        <StyledMenuItem
          className={mainClasses.selectable}
          component={Link}
          aria-label={t('Download CA')}
          href={anchor}
          download={downloadOpts.filename}
          title={downloadOpts.title}
        >
          <ListItemIcon>
            <VerifiedUserIcon />
          </ListItemIcon>
          <ListItemText primary={t('Download CA')} />
        </StyledMenuItem>
      )}
    </List>
  )
}
