import CloudIcon from '@mui/icons-material/Cloud'
import PeopleIcon from '@mui/icons-material/People'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useSession } from 'providers/Session'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  GetAllServicesApiResponse,
  GetTeamApiResponse,
  GetTeamServicesApiResponse,
  GetTeamsApiResponse,
} from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { getDomain } from 'layouts/Shell'

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
  services: GetTeamServicesApiResponse | GetAllServicesApiResponse
  teams: GetTeamsApiResponse
}

const useStyles = makeStyles()((theme) => ({
  grid: {
    '&>.MuiGrid-item': {
      padding: theme.spacing(1),
    },
  },
  card: {
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
    boxShadow: 'none',
    padding: '10px 20px',
  },
  cardSubHeader: {
    fontSize: 20,
    fontWeight: 700,
  },
  cardActionBtn: {
    marginTop: 0,
  },
  cardHeaderTitle: {
    textTransform: 'capitalize',
  },
  iconBtn: {
    color: theme.palette.primary.main,
    marginTop: '10px',
  },
  title: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  teamName: {
    '& > :first-letter': {
      textTransform: 'capitalize',
    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))
// interface DashboardCardProps {
//   item: Panel
//   teamId?: string
//   classes: any
// }

// function DashboardCard({ classes, teamId, item }: DashboardCardProps): React.ReactElement {
//   const prefix = item.name === 'service' && teamId ? `/teams/${teamId}` : ''
//   return (
//     <Grid item xs={12} sm={6} md={4}>
//       <Card>
//         <CardHeader
//           className={classes.card}
//           data-cy={`card-${item.name}`}
//           avatar={<Avatar aria-label='recipe'>{item.icon}</Avatar>}
//           title={`${item.name}s`}
//           subheader={
//             <Link
//               component={RouterLink}
//               to={item.name === 'service' ? `${prefix}/${item.name}s` : `/${item.name}s`}
//               data-cy={`link-${item.name}-count`}
//             >
//               {item.data && item.data.length}
//             </Link>
//           }
//           action={
//             item.canCreate && (
//               <Tooltip title={item.tooltip} aria-label={item.tooltip}>
//                 <span>
//                   <IconButton
//                     aria-label={`Create ${item.name}`}
//                     component={RouterLink}
//                     to={`${prefix}/create-${item.name}`}
//                     className={classes.iconBtn}
//                     disabled={item.disabled}
//                     data-cy={`button-create-${item.name}`}
//                   >
//                     <AddCircleIcon />
//                   </IconButton>
//                 </span>
//               </Tooltip>
//             )
//           }
//         />
//       </Card>
//     </Grid>
//   )
// }
interface DashboardCardProps {
  title: string
  children: any
}

function DashboardCard({ title, children }: DashboardCardProps): React.ReactElement {
  return (
    <Grid item xs={12} mb={2}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
        <Typography variant='h5' sx={{ borderBottom: '1px solid #ccc', textAlign: 'center', padding: '12px' }}>
          {title}
        </Typography>
        <Divider />
        <Box>{children}</Box>
      </Box>
    </Grid>
  )
}

export default function Dashboard({ team, services, teams }: Props): React.ReactElement {
  const theme = useTheme()
  const {
    user: { isAdmin },
    settings: {
      cluster,
      otomi: { additionalClusters = [] },
    },
  } = useSession()
  const { classes } = useStyles()
  const isServiceDisabled = isAdmin && !team
  const { t } = useTranslation()
  const panels = [
    {
      name: 'cluster',
      data: [cluster, ...additionalClusters],
      icon: <CloudIcon />,
      canCreate: false,
      disabled: false,
      tooltip: '',
    },
    {
      name: 'team',
      data: teams,
      icon: <PeopleIcon />,
      canCreate: isAdmin,
      disabled: false,
      tooltip: t('CREATE_MODEL', { model: 'team' }),
    },
    {
      name: 'service',
      data: services,
      icon: <SwapVerticalCircleIcon />,
      canCreate: true,
      disabled: isServiceDisabled,
      tooltip: isServiceDisabled
        ? t('SELECT_TEAM', { model: 'service' })
        : t('CREATE_MODEL_FOR_TEAM', { model: 'service', teamName: team.name }),
    },
  ]
  const teamName = isAdmin ? 'admin' : team.name
  const hostname = window.location.hostname
  const domain = getDomain(hostname)

  const iFrameBaseLink = `https://grafana.${domain}/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const iFrameSmall = `https://grafana.${domain}/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&theme=${theme.palette.mode}&panelId=`
  const data = [
    { name: 'Teams', value: 1 },
    { name: 'Workloads', value: 4 },
    { name: 'Projects', value: 5 },
    { name: 'Services', value: 1 },
    { name: 'Builds', value: 4 },
    { name: 'Secrets', value: 5 },
  ]
  const [iframeOrder, setIframeOrder] = React.useState(0)
  const iframeSources = [
    `${iFrameSmall}1`,
    `${iFrameSmall}2`,
    `${iFrameSmall}3`,
    `${iFrameSmall}4`,
    `${iFrameSmall}5`,
    `${iFrameSmall}6`,
  ]
  const handleIframeLoad = () => {
    // Move to the next iframe
    setIframeOrder((prevOrder) => prevOrder + 1)
  }

  React.useEffect(() => {
    if (iframeOrder < iframeSources.length) {
      const iframe = document.getElementById(`iframe-${iframeOrder}`)
      if (iframe instanceof HTMLIFrameElement) iframe.src = iframeSources[iframeOrder]
    }
  }, [iframeOrder, iframeSources])
  return (
    <Box>
      <DashboardCard title='Inventory'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            margin: '12px',
            px: 8,
          }}
        >
          {data.map(({ name, value }) => (
            <Box
              sx={{
                padding: '12px 48px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '45%',
              }}
            >
              <Typography variant='h6'>{name}</Typography>
              <Typography variant='h6' sx={{ color: 'red' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </DashboardCard>
      <DashboardCard title='Cluster Resource Utilization'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            px: '12px',
          }}
        >
          {iframeSources.map((src, index) => (
            <iframe
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              id={`iframe-${index}`}
              title={`iframe-${index}`}
              style={{
                width: '16%',
                height: '100px',
                border: 'none',
                marginTop: '10px',
                marginBottom: '10px',
              }}
              onLoad={handleIframeLoad}
            />
          ))}
        </Box>
      </DashboardCard>
      {/* <DashboardCard title='Cluster Capacity'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <iframe
            title='Grafana iFrame'
            src={`${iFrameBaseLink}12`}
            style={{
              width: '50%',
              height: '200px',
              border: 'none',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          />
          <iframe
            title='Grafana iFrame'
            src={`${iFrameBaseLink}13`}
            style={{
              width: '50%',
              height: '200px',
              border: 'none',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          />
        </Box>
      </DashboardCard> */}
    </Box>
  )
}
