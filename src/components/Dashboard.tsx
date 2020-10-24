import { Typography, Grid, Card, CardHeader, Avatar, IconButton, makeStyles, Divider, Tooltip } from '@material-ui/core'
import * as React from 'react'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import PeopleIcon from '@material-ui/icons/People'
import CloudIcon from '@material-ui/icons/Cloud'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { Team, Service, Cluster } from '@redkubes/otomi-api-client-axios'
import { Keys as k } from '../translations/keys'
import { useSession } from '../session-context'

type Panel = {
  name: string
  data: any
  icon: any
  canCreate: boolean
  disabled: boolean
  tooltip: string
}
interface Props {
  team?: Team
  isAdmin?: boolean
  services: Array<Service>
  clusters: Array<Cluster>
  teams: Array<Team>
}

const useStyles = makeStyles(theme => ({
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

const DashboardCard = ({ classes, teamId, item }: DashboardCardProps) => {
  const prefix = item.name === 'service' && teamId ? `/teams/${teamId}` : ''
  return (
    <Grid item xs={12} sm={6} md={4}>
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

const Dashboard = ({ team, services, clusters, teams }: Props) => {
  const {
    user: { isAdmin },
  } = useSession()
  const classes = useStyles()
  const isServiceDisabled = isAdmin && !team
  const { t } = useTranslation()
  const panels = [
    { name: 'cluster', data: clusters, icon: <CloudIcon />, canCreate: false, disabled: false, tooltip: '' },
    {
      name: 'team',
      data: teams,
      icon: <PeopleIcon />,
      canCreate: isAdmin,
      disabled: false,
      tooltip: t(k.CREATE_MODEL, { model: 'team' }),
    },
    {
      name: 'service',
      data: services,
      icon: <SwapVerticalCircleIcon />,
      canCreate: true,
      disabled: isServiceDisabled,
      tooltip: isServiceDisabled
        ? t(k.SELECT_TEAM, { model: 'service' })
        : t(k.CREATE_MODEL_FOR_TEAM, { model: 'service', teamName: team.name }),
    },
  ]
  const teamName = isAdmin ? 'admin' : team.name
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom className={classes.title} data-cy='text-welcome'>
            <Trans i18nKey={k.WELCOME_DASHBOARD}>
              Welcome to the team <strong className={classes.teamName}>{{ teamName }}</strong> dashboard!
            </Trans>
          </Typography>
          <Divider />
        </Grid>
        {panels.map(panel => (
          <DashboardCard classes={classes} teamId={team && team.id} item={panel} key={panel.name} />
        ))}
      </Grid>
    </>
  )
}

export default Dashboard
