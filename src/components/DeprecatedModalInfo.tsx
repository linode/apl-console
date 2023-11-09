import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import ForwardIcon from '@mui/icons-material/Forward'

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
  deprecatedApp: any
}

export default function ({ deprecatedApp }: Props): React.ReactElement {
  const { classes, cx } = useStyles()
  const {
    id,
    deprecationInfo: { replacement, message, reasons, replacementAdvantages, options },
  } = deprecatedApp
  const image = (id, img) => {
    return (
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
          currentTarget.src = id
        }}
        alt={`Logo for ${id} app`}
      />
    )
  }

  const toggleDontShowAgain = (e) => {
    const { checked } = e.target
    if (checked) localStorage.setItem(`deprecatedApp_${id}`, 'true')
    else localStorage.removeItem(`deprecatedApp_${id}`)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '200px', position: 'relative', margin: 'auto' }}>
          {image(id, `/logos/${id}_logo.svg`)}
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
        <ForwardIcon sx={{ fontSize: '2rem', color: 'red' }} />
        <Box sx={{ width: '200px', position: 'relative', margin: 'auto' }}>
          {image(replacement, `/logos/${replacement}_logo.svg`)}
        </Box>
      </Box>
      <Box sx={{ mt: '2rem', mb: '1rem' }}>{message}</Box>
      <Box>
        <Box sx={{ fontWeight: 'bold' }}>Reasons:</Box>
        <Box>
          {reasons.map((reason) => (
            <Box sx={{ ml: '1rem' }}>{reason}</Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <Box sx={{ fontWeight: 'bold' }}>Advantages of replacement:</Box>
        <Box>
          {replacementAdvantages.map((advantage) => (
            <Box sx={{ ml: '1rem' }}>{advantage}</Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <Box sx={{ fontWeight: 'bold' }}>Options:</Box>
        <Box>
          {options.map((option) => (
            <Box sx={{ ml: '1rem' }}>{option}</Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: '1rem' }}>
        <FormControlLabel control={<Checkbox onChange={toggleDontShowAgain} />} label="Don't show me again" />
      </Box>
    </Box>
  )
}
