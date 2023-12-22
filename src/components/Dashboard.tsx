import CloudIcon from '@mui/icons-material/Cloud'
import PeopleIcon from '@mui/icons-material/People'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import { Box, Grid, Typography, useTheme } from '@mui/material'
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
import useSettings from 'hooks/useSettings'

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
      <Box sx={{}}>
        <Typography
          variant='h5'
          sx={{ border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', padding: '12px' }}
        >
          {title}
        </Typography>
        <Box>{children}</Box>
      </Box>
    </Grid>
  )
}

export default function Dashboard({ team, services, teams }: Props): React.ReactElement {
  const theme = useTheme()
  const { themeView } = useSettings()
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
  const domainTest = '51.158.129.230.nip.io'

  const iFrameBaseLink = `https://grafana.${domainTest}/d-solo/iJiti6Lnkgg/kubernetes-cluster-status?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const iFrameSmall = `https://grafana.${domainTest}/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=30s&theme=${theme.palette.mode}&panelId=`
  const iFrameUsage = `https://grafana.${domainTest}/d-solo/a87fb0d919ec0ea5f6543124e16c42a5/kubernetes-compute-resources-namespace-workloads?orgId=1&refresh=10s&theme=${theme.palette.mode}&panelId=`
  const iFrameTrivy = `https://grafana.${domainTest}/d-solo/trivy_operator/trivy-operator-reports?orgId=1&refresh=30s&from=1703197681320&to=1703201281320&theme=${theme.palette.mode}&panelId=`
  const iFrameCompliance = `https://grafana.${domainTest}/d-solo/YBgRZG6Mz/opa-gatekeeper-cluster?orgId=1&from=1703200224771&to=1703202024772&theme=${theme.palette.mode}&panelId=38`

  // from=1703196305474&to=1703199905474
  // from=1703196336382&to=1703199936382

  const data = [
    { name: 'Teams', value: 1 },
    { name: 'Workloads', value: 4 },
    { name: 'Projects', value: 5 },
    { name: 'Services', value: 1 },
    { name: 'Builds', value: 4 },
    { name: 'Secrets', value: 5 },
  ]
  const iframeSources = [
    { id: 0, src: `${iFrameSmall}1` },
    { id: 1, src: `${iFrameSmall}3` },
    { id: 2, src: `${iFrameSmall}4` },
    { id: 3, src: `${iFrameSmall}6` },
    { id: 4, src: `${iFrameBaseLink}12` },
    { id: 5, src: `${iFrameBaseLink}13` },
  ]

  const [visibility, _setVisibility] = React.useState(false)
  const setVisibility = () => _setVisibility(true)

  const [isLoad, setLoad] = React.useState(false)
  const onLoad = () => {
    setTimeout(() => {
      setLoad(true)
    }, 1000)
  }

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
      <iframe
        title='Test iFrame'
        src={`${iFrameSmall}1`}
        onLoad={onLoad}
        style={{
          position: 'absolute',
          opacity: 0,
          width: '10px',
          height: '10px',
        }}
      />
      {isLoad && (
        <Box>
          {themeView === 'platform' ? (
            <>
              <DashboardCard title='Cluster Resource Utilization'>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                  }}
                >
                  {iframeSources.slice(0, 4).map((item) => (
                    <iframe
                      key={`iframe-${item.id}`}
                      id={`iframe-${item.id}`}
                      title={`iframe-${item.id}`}
                      src={item.src}
                      style={{
                        width: '25%',
                        height: '100px',
                        border: 'none',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    />
                  ))}
                </Box>
              </DashboardCard>
              <DashboardCard title='Cluster Capacity'>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  {iframeSources.slice(4, 6).map((item) => (
                    <iframe
                      key={`iframe-${item.id}`}
                      id={`iframe-${item.id}`}
                      title={`iframe-${item.id}`}
                      src={item.src}
                      style={{
                        width: '50%',
                        height: '200px',
                        border: 'none',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    />
                  ))}
                </Box>
              </DashboardCard>
            </>
          ) : (
            <>
              <DashboardCard title='Resource Utilization'>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <iframe
                    title='Usage iFrame'
                    src={`${iFrameUsage}3`}
                    onLoad={setVisibility}
                    style={{
                      width: '100%',
                      height: '200px',
                      border: 'none',
                      marginTop: '10px',
                      visibility: visibility ? 'visible' : 'hidden',
                    }}
                  />
                  <iframe
                    title='Usage iFrame'
                    src={`${iFrameUsage}1`}
                    style={{
                      width: '100%',
                      height: '200px',
                      border: 'none',
                      marginTop: '10px',
                    }}
                  />
                </Box>
              </DashboardCard>
              <DashboardCard title='Resource Status'>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <iframe
                    title='Pods iFrame'
                    src={`${iFrameBaseLink}8`}
                    style={{
                      width: '33.3%',
                      height: '200px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                  <iframe
                    title='Pods iFrame'
                    src={`${iFrameBaseLink}9`}
                    style={{
                      width: '33.3%',
                      height: '200px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                  <iframe
                    title='Pods iFrame'
                    src={`${iFrameBaseLink}10`}
                    style={{
                      width: '33.3%',
                      height: '200px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                </Box>
              </DashboardCard>
              <DashboardCard title='Vulnerabilities'>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <iframe
                    title='Trivy iFrame'
                    src={`${iFrameTrivy}60`}
                    style={{
                      width: '25%',
                      height: '100px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                  <iframe
                    title='Trivy iFrame'
                    src={`${iFrameTrivy}49`}
                    style={{
                      width: '25%',
                      height: '100px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                  <iframe
                    title='Trivy iFrame'
                    src={`${iFrameTrivy}50`}
                    style={{
                      width: '25%',
                      height: '100px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                  <iframe
                    title='Trivy iFrame'
                    src={`${iFrameTrivy}51`}
                    style={{
                      width: '25%',
                      height: '100px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                </Box>
              </DashboardCard>
              <DashboardCard title='Compliance'>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <iframe
                    title='Compliance iFrame'
                    src={iFrameCompliance}
                    style={{
                      width: '100%',
                      height: '200px',
                      border: 'none',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  />
                </Box>
              </DashboardCard>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
