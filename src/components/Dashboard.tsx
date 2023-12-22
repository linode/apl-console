import { Box, Grid, Typography, useTheme } from '@mui/material'
import { useSession } from 'providers/Session'
import * as React from 'react'
import { GetTeamApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { getDomain } from 'layouts/Shell'
import useSettings from 'hooks/useSettings'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles()((theme) => ({
  card: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  cardHeaderTitle: {
    textAlign: 'center',
  },
  panelItem: {
    textTransform: 'capitalize',
    color: theme.palette.text.primary,
  },
  inventoryCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: theme.spacing(1),
  },
  inventoryColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
  },
  hiddenIframe: {
    position: 'absolute',
    opacity: 0,
    visibility: 'hidden',
    width: '10px',
    height: '10px',
  },
  iframeRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iframeColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  iframeSmall: {
    width: '25%',
    height: '100px',
    border: 'none',
    margin: '10px 0px',
  },
  iframeMedium: {
    width: '33.3%',
    height: '200px',
    border: 'none',
    margin: '10px 0px',
  },
  iframeLarge: {
    width: '50%',
    height: '200px',
    border: 'none',
    margin: '10px 0px',
  },
  iframeFullWidth: {
    width: '100%',
    height: '200px',
    border: 'none',
    margin: '10px 0px',
  },
}))

type Panel = {
  name: string
  data: any
  icon: any
  canCreate: boolean
  disabled: boolean
  tooltip: string
}
interface Props {
  team?: GetTeamApiResponse
  inventory: any
}

interface DashboardCardProps {
  classes: any
  title: string
  children: any
}

function DashboardCard({ classes, title, children }: DashboardCardProps): React.ReactElement {
  return (
    <Grid item xs={12} mb={2} className={classes.card}>
      <Typography variant='h5' className={classes.cardHeaderTitle}>
        {title}
      </Typography>
      <Box>{children}</Box>
    </Grid>
  )
}

function InventoryCard({ classes, inventory, teamId, themeView }: any): React.ReactElement {
  return (
    <Box className={classes.inventoryCard}>
      <Box className={classes.inventoryColumn}>
        {inventory.slice(0, 3).map((panel) => (
          <PanelItem key={panel.name} item={panel} teamId={teamId} themeView={themeView} classes={classes} />
        ))}
      </Box>
      <Box className={classes.inventoryColumn}>
        {inventory.slice(3).map((panel) => (
          <PanelItem key={panel.name} item={panel} teamId={teamId} themeView={themeView} classes={classes} />
        ))}
      </Box>
    </Box>
  )
}

function PanelItem({ item, themeView, teamId, classes }: any): React.ReactElement {
  const prefix = themeView === 'team' ? `/teams/${teamId}` : ''
  return (
    <Link component={RouterLink} to={`${prefix}/${item.name}`} data-cy={`link-${item.name}-count`}>
      <Box
        sx={{
          padding: '12px 48px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography className={classes.panelItem} variant='h6'>
          {item.name}
        </Typography>
        <Typography variant='h6'>{item.count}</Typography>
      </Box>
    </Link>
  )
}

function IFrame({ id, src, className }: { id: string; src: string; className: string }) {
  return <iframe key={`iframe-${id}`} id={`iframe-${id}`} title={`iframe-${id}`} src={src} className={className} />
}

export default function Dashboard({ team, inventory }: Props): React.ReactElement {
  const theme = useTheme()
  const { themeView } = useSettings()
  const { user, oboTeamId } = useSession()
  const { classes } = useStyles()
  const hostname = window.location.hostname
  const domain = getDomain(hostname)

  // platform view
  const clusterResourceUtilization = `https://grafana.${domain}/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const clusterCapacity = `https://grafana.${domain}/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  // team view
  const resourceStatus = `https://grafana-${oboTeamId}.${domain}/d-solo/iJiti6Lnkgg/team-status?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const resourceUtilization = `https://grafana-${oboTeamId}.${domain}/d-solo/ab4f13a9892a76a4d21ce8c2445bf4ea/kubernetes-pods?orgId=1&theme=${theme.palette.mode}&panelId=`
  const vulnerabilities = `https://grafana-${oboTeamId}.${domain}/d-solo/trivy_operator/trivy-operator-reports?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const compliance = `https://grafana-${oboTeamId}.${domain}/d-solo/YBgRZG6Mz/opa-gatekeeper-cluster?orgId=1&theme=${theme.palette.mode}&panelId=38`

  const iFrameSources = {
    clusterResourceUtilization: [
      { id: '0', src: `${clusterResourceUtilization}1` },
      { id: '1', src: `${clusterResourceUtilization}3` },
      { id: '2', src: `${clusterResourceUtilization}4` },
      { id: '3', src: `${clusterResourceUtilization}6` },
    ],
    clusterCapacity: [
      { id: '4', src: `${clusterCapacity}12` },
      { id: '5', src: `${clusterCapacity}13` },
    ],
    resourceStatus: [
      { id: '8', src: `${resourceStatus}8` },
      { id: '9', src: `${resourceStatus}9` },
      { id: '10', src: `${resourceStatus}10` },
    ],
    resourceUtilization: [
      { id: '6', src: `${resourceUtilization}2` },
      { id: '7', src: `${resourceUtilization}3` },
    ],
    vulnerabilities: [
      { id: '11', src: `${vulnerabilities}60` },
      { id: '12', src: `${vulnerabilities}49` },
      { id: '13', src: `${vulnerabilities}50` },
      { id: '14', src: `${vulnerabilities}51` },
    ],
    compliance: [{ id: '15', src: `${compliance}` }],
  }

  const [isLoad, setLoad] = React.useState(false)
  const onLoad = () => {
    setTimeout(() => {
      setLoad(true)
    }, 500)
  }

  return (
    <Box>
      <DashboardCard classes={classes} title='Inventory'>
        <InventoryCard classes={classes} inventory={inventory} teamId={team?.id} themeView={themeView} />
      </DashboardCard>
      <iframe
        className={classes.hiddenIframe}
        title='Hidden iFrame'
        src={iFrameSources.clusterResourceUtilization[0].src}
        onLoad={onLoad}
      />
      {isLoad && (
        <Box>
          {themeView === 'platform' ? (
            <>
              <DashboardCard classes={classes} title='Cluster Resource Utilization'>
                <Box className={classes.iframeRow}>
                  {iFrameSources.clusterResourceUtilization.map((item) => (
                    <IFrame id={item.id} src={item.src} className={classes.iframeSmall} />
                  ))}
                </Box>
              </DashboardCard>
              <DashboardCard classes={classes} title='Cluster Capacity'>
                <Box className={classes.iframeRow}>
                  {iFrameSources.clusterCapacity.map((item) => (
                    <IFrame id={item.id} src={item.src} className={classes.iframeLarge} />
                  ))}
                </Box>
              </DashboardCard>
            </>
          ) : (
            <>
              <DashboardCard classes={classes} title='Resource Status'>
                <Box className={classes.iframeRow}>
                  {iFrameSources.resourceStatus.map((item) => (
                    <IFrame id={item.id} src={item.src} className={classes.iframeMedium} />
                  ))}
                </Box>
              </DashboardCard>
              <DashboardCard classes={classes} title='Resource Utilization'>
                <Box className={classes.iframeColumn}>
                  {iFrameSources.resourceUtilization.map((item) => (
                    <IFrame id={item.id} src={item.src} className={classes.iframeFullWidth} />
                  ))}
                </Box>
              </DashboardCard>
              <DashboardCard classes={classes} title='Vulnerabilities'>
                <Box className={classes.iframeRow}>
                  {iFrameSources.vulnerabilities.map((item) => (
                    <IFrame id={item.id} src={item.src} className={classes.iframeSmall} />
                  ))}
                </Box>
              </DashboardCard>
              <DashboardCard classes={classes} title='Compliance'>
                <Box className={classes.iframeColumn}>
                  {iFrameSources.compliance.map((item) => (
                    <IFrame id={item.id} src={item.src} className={classes.iframeFullWidth} />
                  ))}
                </Box>
              </DashboardCard>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
