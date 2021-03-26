import { Card, CardContent, CardMedia, IconButton, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import HelpIcon from '@material-ui/icons/Help'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SettingsIcon from '@material-ui/icons/Settings'
import React from 'react'
import { Link } from 'react-router-dom'

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
    disabled: {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
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

export default ({ img, title, link, disabled }: any): React.ReactElement => {
  const classes = useStyles()

  return (
    <Card className={`${classes.root}${disabled ? ` ${classes.disabled}` : ''}`}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component='h6' variant='h6'>
            {title}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton
            aria-label='app settings'
            component={Link}
            to={`/appsettings/${title}`}
            disabled={disabled}
            onClick={(event) => event.preventDefault()}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label='start' href={link} target='_blank' rel='noopener' disabled={disabled}>
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label='help' disabled={disabled}>
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
