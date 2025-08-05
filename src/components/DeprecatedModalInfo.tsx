import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import ForwardIcon from '@mui/icons-material/Forward'

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
  const { classes, cx } = useStyles()
  const {
    id,
    deprecationInfo: { replacement, message, reasons, replacementAdvantages, options },
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
        {replacement && <ForwardIcon className={classes.arrow} />}
        {replacement && (
          <Box sx={{ width: '200px', position: 'relative', margin: 'auto' }}>
            {image(replacement, `/logos/${replacement}_logo.svg`)}
          </Box>
        )}
      </Box>
      <Box sx={{ mt: '2rem', mb: '1rem' }}>{message}</Box>
      {reasons && (
        <Box>
          <Box sx={{ fontWeight: 'bold' }}>Reasons:</Box>
          <Box>
            {reasons.map((reason) => (
              <Box sx={{ ml: '1rem' }}>{reason}</Box>
            ))}
          </Box>
        </Box>
      )}
      {replacement && replacementAdvantages && (
        <Box sx={{ mt: '1rem' }}>
          <Box sx={{ fontWeight: 'bold' }}>Advantages of replacement:</Box>
          <Box>
            {replacementAdvantages.map((advantage) => (
              <Box sx={{ ml: '1rem' }}>{advantage}</Box>
            ))}
          </Box>
        </Box>
      )}
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
