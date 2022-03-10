import { Box, Typography } from '@mui/material'
import React from 'react'
import { Link as RLink } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    textAlign: 'center',
  },
  img: {
    height: theme.spacing(12),
    margin: 'auto',
  },
  title: {
    // color: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    textAlign: 'center',
    verticalAlign: 'bottom',
  },
}))

export default function ({ id, img, teamId, title }: any): React.ReactElement {
  const { classes } = useStyles()
  return (
    <RLink to={`/apps/${teamId}/${id}`}>
      <Box className={classes.root}>
        <img className={classes.img} src={img} alt={`Logo for ${title} app`} />
        <Typography className={classes.title} variant='h6'>
          {title}
        </Typography>
      </Box>
    </RLink>
  )
}
