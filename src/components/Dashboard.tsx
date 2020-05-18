import { Typography, Grid, Card, CardHeader, Avatar, IconButton, makeStyles, Divider, Tooltip } from '@material-ui/core'
import * as React from 'react'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import PeopleIcon from '@material-ui/icons/People'
import CloudIcon from '@material-ui/icons/Cloud'
import Link from '@material-ui/core/Link';
import { Link as RouterLink} from 'react-router-dom'
import { Team } from '../models'

type Panel = {
  name: string;
  data: any;
  icon: any;
  canCreate: boolean;
}
interface Props {
  team?: Team
  isAdmin?: boolean
  data: {
    services: any
    clusters: any
    teams: any
  }
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
      background: theme.palette.secondary.dark
    }
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

const DashboardCard = ({classes, teamId, item }: DashboardCardProps) => {
  const prefix = teamId ? `/teams/${teamId}` : ''
  return (
    <Grid item xs={12} sm={3}>
      <Card classes={{ root: classes.card }}>
        <CardHeader
          classes={{ subheader: classes.cardSubHeader, action: classes.cardActionBtn, title: classes.cardHeaderTitle }}
          avatar={
            <Avatar aria-label='recipe'>
              {item.icon}
            </Avatar>
          }
          title={item.name}
          subheader={(
            <Link 
              component={RouterLink} 
              to={item.name === 'service' ? `${prefix}/${item.name}s` : `/${item.name}s`}>
                {item.data && item.data.length}
            </Link>
          )}
          action={ item.canCreate &&
            <Tooltip title={`Create ${item.name}`} aria-label={`create ${item.name}`} >
              <IconButton aria-label='settings' component={RouterLink} to={`${prefix}/create-${item.name}`} className={classes.iconBtn}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>            
          }
        />
      </Card>
    </Grid>
  )
}

const Dashboard = ({ team, data: { services, clusters, teams }, isAdmin }: Props): any => {
  const classes = useStyles()
  const panels = [
    {name: 'cluster', data: clusters, icon:  <CloudIcon />, canCreate: false}, 
    {name: 'team', data: teams, icon:  <PeopleIcon />, canCreate: isAdmin }, 
    {name: 'service', data: services, icon:  <SwapVerticalCircleIcon />, canCreate: true}, 
  ]
  return (
    <>
      <Grid container spacing={3}>        
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            Welcome to the team <b className={classes.teamName}>{team ? team.name : 'Admin'}</b> dashboard!
          </Typography>
          <Divider />
        </Grid>
        {panels.map(panel => <DashboardCard 
          classes={classes} 
          teamId={team && team.teamId} 
          item={panel}
          key={panel.name}/>
        )}
      </Grid>
    </>
  )
}

export default Dashboard
