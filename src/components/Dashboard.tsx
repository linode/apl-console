import { Box, Card, Grid, Typography, useTheme } from '@mui/material'
import { useSession } from 'providers/Session'
import * as React from 'react'
import { makeStyles } from 'tss-react/mui'
import { getDomain } from 'layouts/Shell'
import useSettings from 'hooks/useSettings'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import { GetTeamApiResponse } from 'redux/otomiApi'
import UpgradeVersion from './UpgradeVersion'

// styles -----------------------------------------------------------
const useStyles = makeStyles()((theme) => ({
  card: {
    padding: theme.spacing(1),
  },
  inventoryItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
  },
  inventoryName: {
    textTransform: 'capitalize',
    color: theme.palette.text.primary,
    fontSize: '14px',
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
    margin: '10px 0px',
  },
  iframeMedium: {
    width: '33.3%',
    height: '200px',
    margin: '10px 0px',
  },
  iframeLarge: {
    width: '50%',
    height: '200px',
    margin: '10px 0px',
  },
  iframeFullWidth: {
    width: '100%',
    height: '200px',
    margin: '10px 0px',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  iframeBorderMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '1px solid white',
    pointerEvents: 'none',
    background: 'transparent',
    zIndex: 1,
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
  classes: any
  themeMode: string
}

interface IFramesCardProps {
  classes: any
  title: string
  iframeSources: any[]
  iframeClass: string
  themeMode: string
  show?: boolean
}

// components ------------------------------------------------------
function InventoryItem({ classes, item, themeView, teamId }: InventoryItemProps): React.ReactElement {
  const isTeamView = themeView === 'team'
  return (
    <Link
      component={isTeamView ? RouterLink : Box}
      to={`/teams/${teamId}/${item.name}`}
      data-cy={`link-${item.name}-count`}
    >
      <Box className={classes.inventoryItem}>
        <Typography className={classes.inventoryName} variant='h6'>
          {item.name.replace('-', ' ')}
        </Typography>
        <Typography fontSize={14}>{item.count}</Typography>
      </Box>
    </Link>
  )
}

function InventoryCard({ classes, title, inventory, themeView, teamId }: InventoryCardProps): React.ReactElement {
  const columnItemNumber = Math.round(inventory.length / 2)
  return (
    <Grid item xs={12} mb={2} className={classes.card}>
      <Typography variant='h5' ml={2}>
        {title}
      </Typography>
      <Box className={classes.inventoryCard}>
        <Box className={classes.inventoryColumn}>
          {inventory.slice(0, columnItemNumber).map((panel) => (
            <InventoryItem key={panel.name} item={panel} teamId={teamId} themeView={themeView} classes={classes} />
          ))}
        </Box>
        <Box className={classes.inventoryColumn}>
          {inventory.slice(columnItemNumber).map((panel) => (
            <InventoryItem key={panel.name} item={panel} teamId={teamId} themeView={themeView} classes={classes} />
          ))}
        </Box>
      </Box>
    </Grid>
  )
}

function IFrame({ id, src, className, classes, themeMode }: IFrameProps) {
  return (
    <div className={className} style={{ position: 'relative' }}>
      {themeMode === 'light' && <div className={classes.iframeBorderMask} />}
      <iframe key={`iframe-${id}`} id={`iframe-${id}`} title={`iframe-${id}`} src={src} className={classes.iframe} />
    </div>
  )
}

function IFramesCard({ classes, title, iframeSources, iframeClass, themeMode, show = false }: IFramesCardProps) {
  const boxClass = iframeClass.includes('iframeFullWidth') ? classes.iframeColumn : classes.iframeRow
  if (!show) return null
  return (
    <Grid item xs={12} mb={2} className={classes.card}>
      <Typography variant='h5' ml={2}>
        {title}
      </Typography>
      <Box className={boxClass}>
        {iframeSources.map((item) => (
          <IFrame
            key={item.id}
            id={item.id}
            src={item.src}
            className={iframeClass}
            classes={classes}
            themeMode={themeMode}
          />
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
  const { oboTeamId, appsEnabled, user, versions } = useSession()
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
  const views = {
    platform: [
      {
        title: 'Cluster Resource Utilization',
        iframeClass: classes.iframeLarge,
        iframeSources: [
          { id: '0', src: `${clusterResourceUtilization}1` },
          { id: '2', src: `${clusterResourceUtilization}4` },
        ],
        show: appsEnabled.grafana,
      },
      {
        title: 'Cluster Resource Requests Commitment',
        iframeClass: classes.iframeLarge,
        iframeSources: [
          { id: '4', src: `${clusterResourceUtilization}2` },
          { id: '5', src: `${clusterResourceUtilization}5` },
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
        show: team?.managedMonitoring?.grafana && oboTeamId !== 'admin',
      },
      {
        title: 'Resource Utilization',
        iframeClass: classes.iframeLarge,
        iframeSources: [
          { id: '9', src: `${resourceUtilization}8` },
          { id: '10', src: `${resourceUtilization}9` },
        ],
        show: team?.managedMonitoring?.grafana && oboTeamId !== 'admin',
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
        show: team?.managedMonitoring?.grafana && oboTeamId !== 'admin' && appsEnabled.trivy,
      },
    ],
  }

  return (
    <Box>
      {themeView === 'platform' && user?.isPlatformAdmin && <UpgradeVersion version={versions?.core} />}
      <Card>
        <InventoryCard
          classes={classes}
          inventory={inventory}
          teamId={oboTeamId}
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
                key={item.title}
                classes={classes}
                title={item.title}
                iframeSources={item.iframeSources}
                iframeClass={item.iframeClass}
                show={item.show}
                themeMode={theme.palette.mode}
              />
            ))}
          </Box>
        )}
      </Card>
    </Box>
  )
}
