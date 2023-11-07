import { Box } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
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
interface Props {
  id: string
  title: string
  img: string
  imgAlt: string
}

export default function ({ id, title, img, imgAlt }: Props): React.ReactElement {
  const { classes, cx } = useStyles()
  const image = (
    <img
      draggable={false}
      className={cx(
        classes.img,
        // this is ofcourse not good code, but it'll do for the time being
        // eslint-disable-next-line no-nested-ternary
        id === 'vault' || id === 'kubeapps'
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
      alt={`Logo for deprecated ${title} app`}
    />
  )
  return (
    <Box>
      <Box sx={{ width: '200px', position: 'relative', margin: 'auto' }}>
        {image}
        <Box
          component='img'
          sx={{
            position: 'absolute',
            transform: 'rotate(-15deg)',
            top: '30%',
            m: 'auto',
            width: 'calc(100% - 20px)',
          }}
          src='/assets/deprecated_text.svg'
          alt='deprecated_text'
        />
      </Box>
      <Box sx={{ mt: '2rem', mb: '1rem' }}>Drone is deprecated!</Box>
      <Box>
        <ul>
          <li>Why?</li>
          <li>What to do?</li>
          <li>How to?</li>
        </ul>
      </Box>
    </Box>
  )
}
