import { Box, Chip, Tooltip, Typography, useTheme } from '@mui/material'
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
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      margin: '5px',
      maxHeight: '200px',
      height: '58px',
    },
    img: {
      height: '32px',
      width: '32px',
    },
    chip: {
      height: '20px',
      fontSize: '0.65rem',
      border: 'none',
      borderRadius: '5px',
    },
    chipDark: {
      color: 'rgb(174, 192, 245)',
      backgroundColor: 'lch(77.7 28.7 275 / 0.12)',
    },
    chipLight: {
      color: '#696970',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
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
  const { classes, cx } = useStyles()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
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
            <Box>
              <Chip
                className={cx(classes.chip, isLight ? classes.chipLight : classes.chipDark)}
                label='BETA'
                variant='outlined'
              />
            </Box>
          )}
        </Link>
      </Tooltip>
    </Box>
  )
}
