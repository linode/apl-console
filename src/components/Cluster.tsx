import React from 'react'
import { Link, ListItem, List, ListItemText, ListItemIcon, MenuItem } from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import generateDownloadLink from 'generate-download-link'
import { useMainStyles } from 'common/theme'
import { makeStyles } from 'tss-react/mui'
import { useSession } from 'common/session-context'

import canDo from 'utils/permission'

const useStyles = makeStyles()(theme => ({
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

export default (): React.ReactElement => {
  const { ca, cluster, versions, oboTeamId, user } = useSession()
  const { classes } = useStyles()
  const { classes: mainClasses } = useMainStyles()
  const StyledListItem = ({ className, ...props }: any) => (
    <ListItem className={`${classes.listItem}, ${className}`} {...props} />
  )
  const StyledMenuItem = (props: any) => <MenuItem className={mainClasses.selectable} {...props} />

  const isButtonDisabled = !canDo(user, oboTeamId, 'downloadKubeConfig')
  const downloadOpts = {
    data: ca ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = ca ? generateDownloadLink(downloadOpts) : ''
  return (
    <>
      <List dense>
        <StyledListItem>
          <ListItemText primary={`Name: ${cluster.name}`} data-cy='list-item-text-clustername' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Cloud: ${cluster.provider}`} data-cy='list-item-text-cloud' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Region: ${cluster.region}`} data-cy='list-item-text-region' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`K8S Version: ${cluster.k8sVersion}`} data-cy='list-item-text-k8v' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Otomi Version: ${versions.core}`} data-cy='list-item-text-k8v' />
        </StyledListItem>
        <StyledMenuItem
          className={mainClasses.selectable}
          component={Link}
          aria-label='download kubecfg'
          href={`/api/v1/kubecfg/${oboTeamId}`}
          disabled={isButtonDisabled}
        >
          <ListItemIcon>
            <CloudDownloadIcon />
          </ListItemIcon>
          <ListItemText primary='Download KUBECFG' />
        </StyledMenuItem>
        {ca && (
          <StyledMenuItem
            className={mainClasses.selectable}
            component={Link}
            aria-label='download certificate authority'
            href={anchor}
            download={downloadOpts.filename}
            title={downloadOpts.title}
          >
            <ListItemIcon>
              <VerifiedUserIcon />
            </ListItemIcon>
            <ListItemText primary='Download CA' />
          </StyledMenuItem>
        )}
      </List>
    </>
  )
}
