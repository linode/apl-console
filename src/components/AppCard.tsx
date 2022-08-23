import { Box, Typography } from '@mui/material'
import React from 'react'
import { useDrag } from 'react-dnd'
import { Link as RLink } from 'react-router-dom'
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
}: any): React.ReactElement {
  const { classes, cx } = useStyles()
  const canDrag = enabled !== undefined
  const [_, dragRef] = useDrag(
    () => ({
      type: 'card',
      item: { name: id },
      canDrag,
      collect: (monitor) => {
        const d = monitor.isDragging()
        if (d) setDeps(deps)
        return {
          localDrag: d,
        }
      },
      end: () => setTimeout(() => setDeps(undefined)),
    }),
    [],
  )
  return (
    <Box
      className={cx(classes.root, (isDragging === undefined ? undefined : !isDragging) && classes.notDragging)}
      ref={dragRef}
    >
      <RLink to={`/apps/${teamId}/${id}`}>
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
        <Typography className={cx(classes.title, isCore && classes.core)} variant='h6'>
          {title}
        </Typography>
      </RLink>
      {enabled !== false && (
        <Box className='hidden-button'>
          <AppButtons id={id} teamId={teamId} setAppState={setAppState} enabled={enabled !== false} hideEnabled />
        </Box>
      )}
    </Box>
  )
}
