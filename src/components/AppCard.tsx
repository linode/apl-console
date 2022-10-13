import { Box, Typography } from '@mui/material'
import { useSession } from 'providers/Session'
import React, { CSSProperties } from 'react'
import { useDrag } from 'react-dnd'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import AppButtons from './AppButtons'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  const m = p.mode
  return {
    root: {
      textAlign: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(4),
      '& .hidden-button': {
        visibility: 'hidden',
      },
      '&:hover .hidden-button': {
        visibility: 'visible',
      },
    },
    img: {
      height: theme.spacing(8),
      maxWidth: theme.spacing(8),
      margin: 'auto',
    },
    title: {
      textAlign: 'center',
      verticalAlign: 'bottom',
    },
    notDragging: {
      opacity: 0.2,
    },
    core: {
      color: `${p.common.white} !important`,
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
}: any): React.ReactElement {
  const session = useSession()
  const {
    editor,
    user: { email },
  } = session
  const isReadOnly = editor && editor !== email
  const { classes, cx } = useStyles()
  const [_, dragRef] = useDrag(
    () => ({
      type: 'card',
      item: { name: id },
      canDrag: isReadOnly ? false : enabled !== undefined,
      collect: (monitor) => {
        const d = monitor.isDragging()
        if (d) setDeps(deps)
        return {
          localDrag: d,
        }
      },
      end: () => setTimeout(() => setDeps(undefined)),
    }),
    [isReadOnly],
  )
  const image = (
    <img
      draggable={false}
      className={cx(classes.img)}
      src={img}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null // prevents looping
        currentTarget.src = imgAlt
      }}
      alt={`Logo for ${title} app`}
    />
  )

  const linkStyle = enabled && externalUrl ? undefined : ({ pointerEvents: 'none' } as CSSProperties)
  return (
    <Box
      className={cx(classes.root, (isDragging === undefined ? undefined : !isDragging) && classes.notDragging)}
      ref={dragRef}
    >
      <Link to={{ pathname: externalUrl }} style={linkStyle} target='_blank'>
        {image}
        <Typography className={cx(classes.title, isCore && classes.core)} variant='h6'>
          {title}
        </Typography>
      </Link>
      {enabled !== false && (
        <Box className='hidden-button'>
          <AppButtons id={id} teamId={teamId} setAppState={setAppState} enabled={enabled !== false} hideEnabled />
        </Box>
      )}
    </Box>
  )
}
