import { Box, Typography } from '@mui/material'
import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import AppButtons from './AppButtons'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
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
      '& .hidden-button': {
        visibility: 'hidden',
        position: 'absolute',
        bottom: '0',
        transform: 'translateX(-50%)',
        left: '50%',
        width: '100%',
      },
      '&:hover .hidden-button': {
        visibility: 'visible',
      },
    },
    disabled: {
      filter: 'grayscale(1)',
      backgroundColor: theme.palette.divider,
      border: 'none',
    },
    img: {
      height: theme.spacing(8),
      maxWidth: theme.spacing(8),
      margin: 'auto',
    },
    contrast: {
      filter: 'drop-shadow(0 0 2px white)',
    },
    contrastDark: {
      filter: 'grayscale(1) contrast(0.3)',
    },
    title: {
      textAlign: 'center',
      verticalAlign: 'bottom',
      color: theme.palette.text.primary,
      fontWeight: '200',
      marginTop: '5px',
    },
    notDragging: {
      opacity: 0.2,
    },
  }
})

// const Ribbon = styled('div')`
//   --f: 10px; /* control the folded part*/
//   --r: 15px; /* control the ribbon shape */
//   --t: 10px; /* the top offset */

//   position: absolute;
//   inset: var(--t) calc(-1 * var(--f)) auto auto;
//   padding: 0 10px var(--f) calc(10px + var(--r));
//   clip-path: polygon(
//     0 0,
//     100% 0,
//     100% calc(100% - var(--f)),
//     calc(100% - var(--f)) 100%,
//     calc(100% - var(--f)) calc(100% - var(--f)),
//     0 calc(100% - var(--f)),
//     var(--r) calc(50% - var(--f) / 2)
//   );
//   background: #bd1550;
//   box-shadow: 0 calc(-1 * var(--f)) 0 inset #0005;
//   font-size: 10px;
// `

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
}: any): React.ReactElement {
  const { classes, cx } = useStyles()
  const image = (
    <img
      draggable={false}
      className={cx(
        classes.img,
        // this is ofcourse not good code, but it'll do for the time being
        // eslint-disable-next-line no-nested-ternary
        (id === 'vault' || id === 'kubeapps') && !enabled
          ? classes.contrastDark
          : id === 'vault' || id === 'kubeapps'
          ? classes.contrast
          : '',
      )}
      src={img}
      onError={({ currentTarget }) => {
        // eslint-disable-next-line no-param-reassign
        currentTarget.onerror = null // prevents looping
        // eslint-disable-next-line no-param-reassign
        currentTarget.src = imgAlt
      }}
      alt={`Logo for ${title} app`}
    />
  )

  const linkStyle =
    enabled && externalUrl
      ? { textDecoration: 'none' }
      : ({ pointerEvents: 'none', textDecoration: 'none' } as CSSProperties)
  return (
    <Box className={cx(classes.root, !enabled && classes.disabled)}>
      {/* {hostedByOtomi && <Ribbon>core</Ribbon>} */}

      <Link to={{ pathname: externalUrl }} style={linkStyle} target='_blank'>
        {image}
        <Typography className={cx(classes.title)} variant='h6'>
          {title}
        </Typography>
      </Link>

      <Box className='hidden-button'>
        <AppButtons
          id={id}
          teamId={teamId}
          enabled={enabled}
          externalUrl={externalUrl}
          setAppState={setAppState}
          setDeps={setDeps}
          toggleApp={toggleApp}
          appTitle={title}
          isHostedByOtomi={hostedByOtomi}
        />
      </Box>
    </Box>
  )
}
