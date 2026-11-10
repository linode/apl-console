import { Box, Chip, Typography } from '@mui/material'
import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import AppButtons from './AppButtons'

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
      '& .hidden-button': {
        visibility: 'hidden',
        position: 'relative',
        transform: 'translateX(0)',
        width: 'auto',
      },
      '&:hover .hidden-button': {
        visibility: 'visible',
      },
      '&:hover': {
        borderColor: theme.palette.cm.linkActiveLight,
      },
    },
    disabled: {
      filter: 'grayscale(1)',
      backgroundColor: theme.palette.divider,
      border: 'none',
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
    deprecated: {
      color: theme.palette.warning.main,
    },
    contrast: {
      filter: 'drop-shadow(0 0 2px white)',
    },
    contrastDark: {
      filter: 'grayscale(1) contrast(0.3)',
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
      textTransform: 'capitalize',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    notDragging: {
      opacity: 0.2,
    },
  }
})

export default function ({
  enabled,
  id,
  img,
  imgAlt,
  teamId,
  title,
  externalUrl,
  hostedByOtomi,
  toggleApp,
  isDeprecated,
  isBeta,
  isAlpha,
  openModal,
}: any): React.ReactElement {
  const { classes, cx } = useStyles()
  const image = (
    <img
      draggable={false}
      className={classes.img}
      src={img}
      onError={(event) => {
        const target = event.currentTarget
        target.onerror = null // prevents looping
        target.src = imgAlt
      }}
      alt={`Logo for ${title} app`}
    />
  )

  const linkStyle =
    enabled && externalUrl
      ? { textDecoration: 'none' }
      : ({ pointerEvents: 'none', textDecoration: 'none' } as CSSProperties)

  const isDeprecatedLocalStorage = localStorage.getItem(`deprecatedApp_${id}`)

  const handleClickModal = (e) => {
    if (!isDeprecatedLocalStorage && isDeprecated) {
      e.preventDefault()
      openModal()
    }
  }

  return (
    <Box className={cx(classes.root, !enabled && classes.disabled)}>
      <Link
        className={cx(classes.link)}
        to={{ pathname: externalUrl }}
        onClick={handleClickModal}
        style={linkStyle}
        target='_blank'
      >
        {image}
        <Typography className={cx(classes.title)} variant='h6'>
          {title}
        </Typography>
        {isBeta && (
          <Box>
            <Chip className={classes.chip} label='BETA' variant='outlined' />
          </Box>
        )}

        {isAlpha && (
          <Box>
            <Chip className={classes.chip} label='ALPHA' variant='outlined' />
          </Box>
        )}

        {isDeprecated && (
          <Box>
            <Chip className={cx(classes.chip, classes.deprecated)} label='DEPRECATED' variant='outlined' />
          </Box>
        )}
      </Link>
      <Box className='hidden-button'>
        <AppButtons
          id={id}
          teamId={teamId}
          enabled={enabled}
          toggleApp={toggleApp}
          externalUrl={externalUrl}
          isHostedByOtomi={hostedByOtomi}
          handleClickModal={handleClickModal}
        />
      </Box>
    </Box>
  )
}
