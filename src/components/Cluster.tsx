import React from 'react'
import { Link, ListItem, List, ListItemText, makeStyles, ListItemIcon, MenuItem } from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import generateDownloadLink from 'generate-download-link'
import { useSession } from '../session-context'
import { mainStyles } from '../theme'
import canDo from '../utils/permission'

const baseUrl = process.env.CONTEXT_PATH || ''

const useStyles = makeStyles((theme) => ({
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
  const { cluster, versions, oboTeamId, user } = useSession()
  const classes = useStyles()
  const mainClasses = mainStyles()
  const StyledListItem = ({ className, ...props }: any) => {
    return <ListItem className={`${classes.listItem}, ${className}`} {...props} />
  }
  const StyledMenuItem = (props: any) => {
    return <MenuItem className={mainClasses.selectable} {...props} />
  }

  const isButtonDisabled = !canDo(user, oboTeamId, 'downloadKubeConfig')
  const downloadOpts = {
    data: process.env.CUSTOM_ROOT_CA ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = generateDownloadLink(downloadOpts)
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
          href={`${baseUrl}/api/v1/kubecfg/${oboTeamId}`}
          disabled={isButtonDisabled}
        >
          <ListItemIcon>
            <CloudDownloadIcon />
          </ListItemIcon>
          <ListItemText primary='Download KUBECFG' />
        </StyledMenuItem>
        {downloadOpts.data !== '' && (
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
