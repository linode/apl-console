import { Box, Chip, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
      backgroundColor: theme.palette.divider,
      margin: '5px',
      maxHeight: '200px',
      height: '58px',
      '& .beta-label': {
        visibility: 'visible',
        position: 'relative',
        transform: 'translateX(0) translateY(0)',
        width: 'auto',
      },
      '&:hover .beta-label': {
        visibility: 'hidden',
      },
    },
    img: {
      height: '32px',
      width: '32px',
    },
    link: {
      display: 'flex',
      marginLeft: '5px',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      verticalAlign: 'middle',
      color: theme.palette.text.primary,
      fontWeight: 'bold',
      fontSize: '1rem',
      textTransform: 'capitalize',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
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
        <Link className={classes.link} to={`/catalogs/${teamId}/${name}`} style={{ textDecoration: 'none' }}>
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
