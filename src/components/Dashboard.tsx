import { Typography, Grid, Card, CardHeader, Avatar, IconButton, makeStyles, Divider } from '@material-ui/core'
import * as React from 'react'
import AddCircleIcon from '@material-ui/icons/Add'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import PeopleIcon from '@material-ui/icons/People'
import CloudIcon from '@material-ui/icons/Cloud'
import { Team } from '../models'

interface Props {
  team?: Team
}

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow: 'none',
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
  avatar: {
    // backgroundColor: red[500],
  },
}))

const Dashboard = ({ team }: Props): any => {
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
              avatar={
                <Avatar aria-label='recipe' className={classes.avatar}>
                  <CloudIcon />
                </Avatar>
              }
              title='Clusters'
              subheader='6' // TODO
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card classes={{ root: classes.card }}>
            <CardHeader
              avatar={
                <Avatar aria-label='recipe' className={classes.avatar}>
                  <PeopleIcon />
                </Avatar>
              }
              title='Teams'
              subheader='30' // TODO
              action={
                <IconButton aria-label='settings'>
                  <AddCircleIcon />
                </IconButton>
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card classes={{ root: classes.card }}>
            <CardHeader
              avatar={
                <Avatar aria-label='recipe' className={classes.avatar}>
                  <SwapVerticalCircleIcon />
                </Avatar>
              }
              action={
                <IconButton aria-label='settings'>
                  <AddCircleIcon />
                </IconButton>
              }
              title='Services'
              subheader='30' // TODO
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
