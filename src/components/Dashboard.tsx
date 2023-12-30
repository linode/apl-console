import { Box, Grid, Typography, useTheme } from '@mui/material'
import { useSession } from 'providers/Session'
import * as React from 'react'
import { GetTeamApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { getDomain } from 'layouts/Shell'
import useSettings from 'hooks/useSettings'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

// styles -----------------------------------------------------------
const useStyles = makeStyles()((theme) => ({
  card: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  cardHeaderTitle: {
    textAlign: 'center',
    color: theme.palette.grey[500],
  },
  inventoryItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
  },
  inventoryName: {
    textTransform: 'capitalize',
    color: theme.palette.grey[500],
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
    width: '30%',
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

// types -----------------------------------------------------------
interface Props {
  team?: GetTeamApiResponse
  inventory: any
}

interface InventoryItemProps {
  classes: any
  item: { name: string; count: number }
  themeView: string
  teamId: string
}

interface InventoryCardProps {
  classes: any
  title: string
  inventory: any
  themeView: string
  teamId: string
}

interface IFrameProps {
  id: string
  src: string
  className: string
}

interface IFramesCardProps {
  classes: any
  title: string
  iframeSources: any[]
  iframeClass: string
  show?: boolean
}

// components ------------------------------------------------------
function InventoryItem({ classes, item, themeView, teamId }: InventoryItemProps): React.ReactElement {
  const prefix = themeView === 'team' ? `/teams/${teamId}` : ''
  return (
    <Link component={RouterLink} to={`${prefix}/${item.name}`} data-cy={`link-${item.name}-count`}>
      <Box className={classes.inventoryItem}>
        <Typography className={classes.inventoryName} variant='h5'>
          {item.name}
        </Typography>
        <Typography variant='h5'>{item.count}</Typography>
      </Box>
    </Link>
  )
}

function InventoryCard({ classes, title, inventory, themeView, teamId }: InventoryCardProps): React.ReactElement {
  return (
    <Grid item xs={12} mb={2} className={classes.card}>
      <Typography variant='h5' className={classes.cardHeaderTitle}>
        {title}
      </Typography>
      <Box className={classes.inventoryCard}>
        <Box className={classes.inventoryColumn}>
          {inventory.slice(0, 3).map((panel) => (
            <InventoryItem key={panel.name} item={panel} teamId={teamId} themeView={themeView} classes={classes} />
          ))}
        </Box>
        <Box className={classes.inventoryColumn}>
          {inventory.slice(3).map((panel) => (
            <InventoryItem key={panel.name} item={panel} teamId={teamId} themeView={themeView} classes={classes} />
          ))}
        </Box>
      </Box>
    </Grid>
  )
}

function IFrame({ id, src, className }: IFrameProps) {
  return <iframe key={`iframe-${id}`} id={`iframe-${id}`} title={`iframe-${id}`} src={src} className={className} />
}

function IFramesCard({ classes, title, iframeSources, iframeClass, show = false }: IFramesCardProps) {
  const boxClass = iframeClass.includes('iframeFullWidth') ? classes.iframeColumn : classes.iframeRow
  if (!show) return null
  return (
    <Grid item xs={12} mb={2} className={classes.card}>
      <Typography variant='h5' className={classes.cardHeaderTitle}>
        {title}
      </Typography>
      <Box className={boxClass}>
        {iframeSources.map((item) => (
          <IFrame id={item.id} src={item.src} className={iframeClass} />
        ))}
      </Box>
    </Grid>
  )
}

// main jsx --------------------------------------------------------
export default function Dashboard({ team, inventory }: Props): React.ReactElement {
  const theme = useTheme()
  const { classes } = useStyles()
  const { themeView } = useSettings()
  const { oboTeamId, appsEnabled } = useSession()
  const hostname = window.location.hostname
  const domain = getDomain(hostname)
  const [isCookiesLoaded, setCookiesLoaded] = React.useState(false)
  const onLoad = () => {
    setTimeout(() => {
      setCookiesLoaded(true)
    }, 500)
  }
  React.useEffect(() => {
    setCookiesLoaded(false)
  }, [themeView])

  // platform view base iframe urls
  const clusterResourceUtilization = `https://grafana.${domain}/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const clusterCapacity = `https://grafana.${domain}/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  // team view base iframe urls
  const resourceStatus = `https://grafana-${oboTeamId}.${domain}/d-solo/iJiti6Lnkgg/team-status?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const resourceUtilization = `https://grafana-${oboTeamId}.${domain}/d-solo/JcVjFgdZz/kubernetes-deployment?orgId=1&theme=${theme.palette.mode}&panelId=`
  const vulnerabilities = `https://grafana-${oboTeamId}.${domain}/d-solo/trivy_operator/container-scan-results?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const compliance = `https://grafana-${oboTeamId}.${domain}/d-solo/YBgRZG6Mzz/policy-violations?orgId=1&theme=${theme.palette.mode}&panelId=`

  const views = {
    platform: [
      {
        title: 'Cluster Resource Utilization',
        iframeClass: classes.iframeSmall,
        iframeSources: [
          { id: '0', src: `${clusterResourceUtilization}1` },
          { id: '1', src: `${clusterResourceUtilization}3` },
          { id: '2', src: `${clusterResourceUtilization}4` },
          { id: '3', src: `${clusterResourceUtilization}6` },
        ],
        show: appsEnabled.grafana,
      },
      {
        title: 'Cluster Capacity',
        iframeClass: classes.iframeLarge,
        iframeSources: [
          { id: '4', src: `${clusterCapacity}12` },
          { id: '5', src: `${clusterCapacity}13` },
        ],
        show: appsEnabled.grafana,
      },
    ],
    team: [
      {
        title: 'Resource Status',
        iframeClass: classes.iframeMedium,
        iframeSources: [
          { id: '6', src: `${resourceStatus}8` },
          { id: '7', src: `${resourceStatus}9` },
          { id: '8', src: `${resourceStatus}10` },
        ],
        show: team?.managedMonitoring?.grafana,
      },
      {
        title: 'Resource Utilization',
        iframeClass: classes.iframeLarge,
        iframeSources: [
          { id: '9', src: `${resourceUtilization}8` },
          { id: '10', src: `${resourceUtilization}9` },
        ],
        show: team?.managedMonitoring?.grafana,
      },
      {
        title: 'Vulnerabilities',
        iframeClass: classes.iframeSmall,
        iframeSources: [
          { id: '11', src: `${vulnerabilities}60` },
          { id: '12', src: `${vulnerabilities}49` },
          { id: '13', src: `${vulnerabilities}50` },
          { id: '14', src: `${vulnerabilities}51` },
        ],
        show: team?.managedMonitoring?.grafana && appsEnabled.trivy,
      },
      {
        title: 'Compliance',
        iframeClass: classes.iframeFullWidth,
        iframeSources: [{ id: '15', src: `${compliance}41` }],
        show: team?.managedMonitoring?.grafana && appsEnabled.gatekeeper,
      },
    ],
  }

  return (
    <Box>
      <InventoryCard
        classes={classes}
        inventory={inventory}
        teamId={team?.id}
        themeView={themeView}
        title='Inventory'
      />
      {/* Cookies Hack: Hidden iframe to load cookies for grafana */}
      <iframe
        className={classes.hiddenIframe}
        title='Hidden iFrame'
        src={views[themeView][0].iframeSources[0].src}
        onLoad={onLoad}
      />
      {isCookiesLoaded && (
        <Box>
          {views[themeView].map((item) => (
            <IFramesCard
              classes={classes}
              title={item.title}
              iframeSources={item.iframeSources}
              iframeClass={item.iframeClass}
              show={item.show}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
