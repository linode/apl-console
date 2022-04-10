import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { Link, List, ListItem, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useMainStyles } from 'common/theme'
import generateDownloadLink from 'generate-download-link'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import canDo from 'utils/permission'

const useStyles = makeStyles()((theme) => ({
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  listItem: {
    height: theme.spacing(5),
  },
  listItemSmall: {
    height: theme.spacing(3),
  },
}))

export default function (): React.ReactElement {
  const {
    ca,
    settings: {
      cluster: { name, provider, region, k8sVersion },
    },
    versions,
    oboTeamId,
    user,
  } = useSession()
  const { classes } = useStyles()
  const { classes: mainClasses } = useMainStyles()
  const { t } = useTranslation()
  // END HOOKS
  const StyledListItem = React.memo(({ className, ...props }: any) => (
    <ListItem className={`${classes.listItem}, ${className}`} {...props} />
  ))
  const StyledMenuItem = React.memo((props: any) => <MenuItem className={mainClasses.selectable} {...props} />)

  const downloadOpts = {
    data: ca ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = ca ? generateDownloadLink(downloadOpts) : ''
  return (
    <List dense>
      <StyledListItem>
        <ListItemText primary={t('NOTE_INFO', { title: t('Name'), desc: name })} data-cy='list-item-text-clustername' />
      </StyledListItem>
      <StyledListItem>
        <ListItemText
          primary={t('NOTE_INFO', { title: t('Provider'), desc: provider })}
          data-cy='list-item-text-cloud'
        />
      </StyledListItem>
      <StyledListItem>
        <ListItemText primary={t('NOTE_INFO', { title: t('Region'), desc: region })} data-cy='list-item-text-region' />
      </StyledListItem>
      <StyledListItem>
        <ListItemText
          primary={t('NOTE_INFO', { title: t('K8S version'), desc: k8sVersion })}
          data-cy='list-item-text-k8v'
        />
      </StyledListItem>
      <StyledListItem>
        <ListItemText
          primary={t('NOTE_INFO', { title: t('Otomi version'), desc: versions.core })}
          data-cy='list-item-text-core'
        />
      </StyledListItem>
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
