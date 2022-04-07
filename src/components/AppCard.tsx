import { Box, Typography } from '@mui/material'
import React from 'react'
import { useDrag } from 'react-dnd'
import { Link as RLink } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

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
    <RLink to={`/apps/${teamId}/${id}`}>
      <Box
        className={cx(classes.root, (isDragging === undefined ? undefined : !isDragging) && classes.notDragging)}
        ref={dragRef}
      >
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
        <Typography className={cx(classes.title, enabled === undefined && classes.core)} variant='h6'>
          {title}
        </Typography>
      </Box>
    </RLink>
  )
}
