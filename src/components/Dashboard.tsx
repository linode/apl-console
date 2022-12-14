import AddCircleIcon from '@mui/icons-material/AddCircle'
import CloudIcon from '@mui/icons-material/Cloud'
import PeopleIcon from '@mui/icons-material/People'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import { Avatar, Card, CardHeader, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import Link from '@mui/material/Link'
import { useSession } from 'providers/Session'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import {
  GetAllServicesApiResponse,
  GetTeamApiResponse,
  GetTeamServicesApiResponse,
  GetTeamsApiResponse,
} from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import MessageTrans from './MessageTrans'

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
    color: theme.palette.primary.contrastText,
    boxShadow: 'none',
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
    color: theme.palette.primary.dark,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
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
interface DashboardCardProps {
  item: Panel
  teamId?: string
  classes: any
}

function DashboardCard({ classes, teamId, item }: DashboardCardProps): React.ReactElement {
  const prefix = item.name === 'service' && teamId ? `/teams/${teamId}` : ''
  return (
    <Grid item xs={12} sm={6} md={4} className={classes.grid}>
      <Card classes={{ root: classes.card }}>
        <CardHeader
          data-cy={`card-${item.name}`}
          classes={{ subheader: classes.cardSubHeader, action: classes.cardActionBtn, title: classes.cardHeaderTitle }}
          avatar={<Avatar aria-label='recipe'>{item.icon}</Avatar>}
          title={`${item.name}s`}
          subheader={
            <Link
              component={RouterLink}
              to={item.name === 'service' ? `${prefix}/${item.name}s` : `/${item.name}s`}
              data-cy={`link-${item.name}-count`}
            >
              {item.data && item.data.length}
            </Link>
          }
          action={
            item.canCreate && (
              <Tooltip title={item.tooltip} aria-label={item.tooltip}>
                <span>
                  <IconButton
                    aria-label={`Create ${item.name}`}
                    component={RouterLink}
                    to={`${prefix}/create-${item.name}`}
                    className={classes.iconBtn}
                    disabled={item.disabled}
                    data-cy={`button-create-${item.name}`}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )
          }
        />
      </Card>
    </Grid>
  )
}

export default function ({ team, services, teams }: Props): React.ReactElement {
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
  return (
    <Grid container className={classes.grid}>
      <Grid item xs={12}>
        <Typography variant='h5' gutterBottom className={classes.title} data-cy='text-welcome'>
          <MessageTrans i18nKey='WELCOME_DASHBOARD'>
            Team <strong className={classes.teamName}>{{ teamName }}</strong> dashboard
          </MessageTrans>
        </Typography>
        <Divider />
      </Grid>
      {panels.map((panel) => (
        <DashboardCard classes={classes} teamId={team?.id} item={panel} key={panel.name} />
      ))}
    </Grid>
  )
}
