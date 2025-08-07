import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  return {
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
    arrow: {
      fontSize: '2rem',
      color: theme.palette.grey[500],
    },
  }
})
interface Props {
  deprecatedApp: any
}

export default function ({ deprecatedApp }: Props): React.ReactElement {
  const { classes } = useStyles()
  const {
    id,
    deprecationInfo: { message, reasons, options },
  } = deprecatedApp
  const image = (id, img) => {
    return (
      <img
        draggable={false}
        className={classes.img}
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
        <Box sx={{ width: '200px', position: 'relative', margin: 'auto' }}>{image(id, `/logos/${id}_logo.svg`)}</Box>
      </Box>
      <Box sx={{ mt: '2rem', mb: '1rem' }}>{message}</Box>
      {reasons && (
        <Box>
          <Box sx={{ fontWeight: 'bold' }}>Reasons:</Box>
          <Box component='ul' sx={{ pl: 2, mt: 1 }}>
            {reasons.map((reason) => (
              <Box component='li' sx={{ ml: '1rem' }} key={reason}>
                {reason}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {options && (
        <Box sx={{ mt: '1rem' }}>
          <Box sx={{ fontWeight: 'bold' }}>Options:</Box>
          <Box component='ul' sx={{ pl: 2, mt: 1 }}>
            {options.map((option) => (
              <Box component='li' sx={{ ml: '1rem' }} key={option}>
                {option}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Box sx={{ mt: '1rem' }}>
        <FormControlLabel control={<Checkbox onChange={toggleDontShowAgain} />} label="Don't show me again" />
      </Box>
    </Box>
  )
}
