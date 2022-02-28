import InfoIcon from '@mui/icons-material/Info'
// import HelpIcon from '@mui/icons-material/Help'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SettingsIcon from '@mui/icons-material/Settings'
import { Card, CardContent, CardMedia, IconButton, Link, Typography } from '@mui/material'
import React from 'react'
import { Link as RLink } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: theme.spacing(20),
    // width: '100%',
  },
  wide: {},
  details: {
    display: 'flex',
    flexDirection: 'column',
    textTransform: 'capitalize',
  },
  disabled: {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  content: {
    flex: '1 0 auto',
  },
  contentWide: {
    flex: '1',
  },
  cover: {
    width: 90,
    margin: 'auto',
  },
  coverWide: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    // height: 38,
    // width: 38,
  },
}))

export default function ({
  teamId,
  img,
  id,
  description,
  shortDescription,
  title,
  link,
  docUrl,
  disabled,
  hideConfButton = false,
  wide = false,
}: any): React.ReactElement {
  const { classes } = useStyles()
  return (
    <Card className={`${classes.root}${disabled ? ` ${classes.disabled}` : ''}`}>
      <div className={classes.details}>
        {!wide && (
          <CardContent className={classes.content}>
            <Typography component='h6' variant='h6'>
              {title}
            </Typography>
          </CardContent>
        )}
        {!wide && (
          <div className={classes.controls}>
            <IconButton aria-label='info' component={RLink} to={`/apps/${teamId}/${id}`} disabled={disabled}>
              <InfoIcon />
            </IconButton>
            {link && (
              <IconButton aria-label='start' href={link} target='_blank' rel='noopener' disabled={disabled}>
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
            )}
            {!hideConfButton && (
              <IconButton
                aria-label='configure'
                component={RLink}
                to={`/apps/${teamId}/${id}#values`}
                disabled={disabled}
              >
                <SettingsIcon />
              </IconButton>
            )}
          </div>
        )}
      </div>
      <CardMedia
        component={Link}
        href={link}
        target='_blank'
        rel='noopener'
        className={`${classes.cover}${wide ? ` ${classes.coverWide}` : ''}`}
        title={title}
      >
        <img src={img} alt={`Logo for ${title} app`} className={classes.cover} />
      </CardMedia>
      {wide && (
        <div className={`${classes.root}`}>
          <CardContent className={classes[`content${wide ?? 'Wide'}`]}>
            <Typography variant='h6'>
              {title}: {shortDescription}
            </Typography>
            <Typography variant='body2'>{description}</Typography>
            <Link href={docUrl}>[...more]</Link>
          </CardContent>
        </div>
      )}
    </Card>
  )
}
