import { Box, Chip, Typography } from '@mui/material'
import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import AppButtons from './AppButtons'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
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
      backgroundColor: '#444444',
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
    disabled: {
      filter: 'grayscale(1)',
      backgroundColor: theme.palette.divider,
      border: 'none',
    },
    img: {
      height: '32px',
      width: '32px',
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
      fontWeight: 'bold',
      fontSize: '1rem',
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
  deps,
  enabled,
  id,
  img,
  imgAlt,
  isDragging,
  setDeps,
  teamId,
  title,
  setAppState,
  isCore = false,
  externalUrl,
  hostedByOtomi,
  toggleApp,
  isDeprecated,
  isBeta,
  openModal,
}: any): React.ReactElement {
  const { classes, cx } = useStyles()
  const image = (
    <img
      draggable={false}
      className={classes.img}
      src={img}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null // prevents looping
        currentTarget.src = imgAlt
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
      </Link>
      {isBeta && (
        <Box className='beta-label'>
          <Chip label='BETA' variant='outlined' />
        </Box>
      )}
      <Box className='hidden-button'>
        <AppButtons
          id={id}
          teamId={teamId}
          enabled={enabled}
          externalUrl={externalUrl}
          setAppState={setAppState}
          toggleApp={toggleApp}
          appTitle={title}
          isHostedByOtomi={hostedByOtomi}
          isDeprecated={isDeprecated}
          handleClickModal={handleClickModal}
        />
      </Box>
    </Box>
  )
}
