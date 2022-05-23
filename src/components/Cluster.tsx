import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { Link, List, ListItem, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useMainStyles } from 'common/theme'
import generateDownloadLink from 'generate-download-link'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

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

function StyledListItem({ className, ...props }: any): React.ReactElement {
  const { classes } = useStyles()
  return <ListItem className={`${classes.listItem}, ${className}`} {...props} />
}

function StyledMenuItem(props: any) {
  const { classes: mainClasses } = useMainStyles()
  return <MenuItem className={mainClasses.selectable} {...props} />
}

export default function (): React.ReactElement {
  const {
    ca,
    settings: {
      cluster: { name, provider, k8sVersion },
    },
    versions,
  } = useSession()
  const { classes: mainClasses } = useMainStyles()
  const { t } = useTranslation()
  // END HOOKS

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
