import { Card, CardContent, CardMedia, IconButton, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import HelpIcon from '@material-ui/icons/Help'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SettingsIcon from '@material-ui/icons/Settings'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: theme.spacing(20),
      textTransform: 'capitalize',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 90,
      margin: 'auto',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
  }),
)

export default function AppCard({ img, title, link }: any) {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component='h6' variant='h6'>
            {title}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label='settings'>
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label='start' href={link} target='_blank' rel='noopener'>
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label='help'>
            <HelpIcon />
          </IconButton>
        </div>
      </div>
      <CardMedia className={classes.cover} title={title}>
        <img src={img} alt={`Logo for ${title} app`} className={classes.cover} />
      </CardMedia>
    </Card>
  )
}
