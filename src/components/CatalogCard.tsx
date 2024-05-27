import { Box, Chip, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      position: 'relative',
      textAlign: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(4),
      border: `1px solid ${theme.palette.divider}`,
      margin: '5px',
      borderRadius: '8px',
      maxHeight: '200px',
      height: '200px',
      '& .beta-label': {
        visibility: 'visible',
        position: 'absolute',
        transform: 'translateX(-50%) translateY(50%)',
        left: '50%',
        width: '100%',
      },
      '&:hover .beta-label': {
        visibility: 'hidden',
      },
    },
    img: {
      height: theme.spacing(8),
      maxWidth: theme.spacing(8),
      margin: 'auto',
    },
    title: {
      display: '-webkit-box',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      textAlign: 'center',
      verticalAlign: 'bottom',
      color: theme.palette.text.primary,
      fontWeight: '200',
      marginTop: '5px',
    },
  }
})

interface Props {
  img: string
  teamId: string
  name: string
  isBeta: boolean
}

export default function ({ img, teamId, name, isBeta }: Props): React.ReactElement {
  const { classes } = useStyles()
  const image = (
    <img
      draggable={false}
      className={classes.img}
      src={img}
      onError={({ currentTarget }) => {
        // eslint-disable-next-line no-param-reassign
        currentTarget.onerror = null // prevents looping
        // eslint-disable-next-line no-param-reassign
        currentTarget.src = img
      }}
      alt={`Logo for ${name}`}
    />
  )

  return (
    <Box className={classes.root}>
      <Tooltip title='Click to create a workload'>
        <Link to={`/catalogs/${teamId}/${name}`} style={{ textDecoration: 'none' }}>
          {image}
          <Typography className={classes.title} variant='h6'>
            {name.replace('otomi-quickstart-', '')}
          </Typography>
          {isBeta && (
            <Box className='beta-label'>
              <Chip label='BETA' variant='outlined' />
            </Box>
          )}
        </Link>
      </Tooltip>
    </Box>
  )
}
