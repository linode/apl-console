import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
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
      width: 151,
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

export default function AppCard({ cluster, teamId, img, title }: any) {
  const classes = useStyles()
  const handleClick = () => {
    window.open(`https://${title}.team-${teamId}.${cluster.domain}`, '_blank')
  }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component='h5' variant='h5'>
            {title}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label='settings'>
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label='start'>
            <PlayArrowIcon onClick={handleClick} className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label='help'>
            <HelpIcon />
          </IconButton>
        </div>
      </div>
      <CardMedia className={classes.cover} image={img} title={title} />
    </Card>
  )
}
