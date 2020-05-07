import { Typography, Grid, Card, CardHeader, Avatar, IconButton, makeStyles, Divider } from '@material-ui/core'
import * as React from 'react'
import AddCircleIcon from '@material-ui/icons/Add'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import PeopleIcon from '@material-ui/icons/People'
import CloudIcon from '@material-ui/icons/Cloud'
import { Link } from 'react-router-dom'
import { Team } from '../models'

interface Props {
  team?: Team
  admin?: boolean
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
    fontSize: 22,
    fontWeight: 700,
  },
  cardAction: {
    marginTop: 8,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 20,
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

const Dashboard = ({ team, data: { services, clusters, teams }, admin }: Props): any => {
  const classes = useStyles()
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h5' gutterBottom className={classes.title}>
            Welcome to the team <b>{team ? team.name : 'Admin'}</b> dashboard!
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card classes={{ root: classes.card }}>
            <CardHeader
              classes={{ subheader: classes.cardSubHeader }}
              avatar={
                <Avatar aria-label='recipe'>
                  <CloudIcon />
                </Avatar>
              }
              title='Clusters'
              subheader={clusters && clusters.length}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card classes={{ root: classes.card }}>
            <CardHeader
              classes={{ subheader: classes.cardSubHeader }}
              avatar={
                <Avatar aria-label='recipe'>
                  <PeopleIcon />
                </Avatar>
              }
              title='Teams'
              subheader={teams && teams.length}
              action={
                admin && (
                  <IconButton aria-label='settings' component={Link} to='/create-team'>
                    <AddCircleIcon />
                  </IconButton>
                )
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card classes={{ root: classes.card }}>
            <CardHeader
              classes={{ subheader: classes.cardSubHeader }}
              avatar={
                <Avatar aria-label='recipe'>
                  <SwapVerticalCircleIcon />
                </Avatar>
              }
              action={
                <IconButton
                  aria-label='settings'
                  component={Link}
                  to={admin ? '/create-service' : `/teams/${(team || {}).teamId}/create-service`}
                >
                  <AddCircleIcon />
                </IconButton>
              }
              title='Services'
              subheader={services && services.length}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
