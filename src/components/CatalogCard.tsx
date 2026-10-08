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
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 0,
      boxShadow: 'none',
      margin: '5px',
      maxHeight: '200px',
      height: '58px',
      '&:hover': {
        borderColor: theme.palette.cm.linkActiveLight,
      },
    },
    img: {
      height: '32px',
      width: '32px',
    },
    chip: {
      height: '20px',
      fontFamily: theme.font.normal,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 0,
      color: theme.palette.info.main,
      backgroundColor: theme.palette.background.paper,
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
      fontFamily: theme.font.normal,
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '20px',
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
  catalogData?: {
    catalogName?: string
  }
}

export default function ({ img, teamId, name, isBeta, catalogData }: Props): React.ReactElement {
  const { classes } = useStyles()
  const image = (
    <img
      draggable={false}
      className={classes.img}
      src={img}
      onError={({ currentTarget }) => {
        // eslint-disable-next-line no-param-reassign
        currentTarget.src = '/logos/akamai_logo.svg'
      }}
      alt={`Logo for ${name}`}
    />
  )

  return (
    <Box className={classes.root}>
      <Tooltip title='Click to create a workload'>
        <Link
          className={classes.link}
          to={{
            pathname: `/teams/${teamId}/catalogs/${name}`,
            state: catalogData,
          }}
          style={{ textDecoration: 'none' }}
        >
          {image}
          <Typography className={classes.title} variant='h6'>
            {name}
          </Typography>
          {isBeta && (
            <Box>
              <Chip className={classes.chip} label='BETA' variant='outlined' />
            </Box>
          )}
        </Link>
      </Tooltip>
    </Box>
  )
}
