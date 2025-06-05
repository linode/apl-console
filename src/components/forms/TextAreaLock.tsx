import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Box } from '@mui/material'

const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '21px',
    width: '16px',
    marginTop: '8px',
  },
  lock: {
    width: '16px',
    height: '16px',
    background: theme.palette.primary.main,
    borderRadius: '3px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.6s ease-in, opacity 0.6s ease-in',
    '&::after': {
      content: '""',
      display: 'block',
      background: theme.palette.background.paper,
      borderRadius: '4px',
      width: '4px',
      height: '4px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: '-2px 0 0 -2px',
      transition: 'all 0.1s ease-in-out',
    },
    '&::before': {
      content: '""',
      display: 'block',
      width: '10px',
      height: '7px',
      bottom: '100%',
      position: 'absolute',
      left: '50%',
      marginLeft: '-5px',
      border: `2px solid ${theme.palette.primary.main}`,
      borderTopRightRadius: '50%',
      borderTopLeftRadius: '50%',
      borderBottom: '0',
      transition: 'all 0.1s ease-in-out',
    },
    '&:hover::before': {
      height: '9px',
    },
  },
  unlocked: {
    transform: 'rotate(10deg) translateY(150px)',
    opacity: 0,
    background: theme.palette.error.main,
    '&::after': {
      background: theme.palette.background.paper,
    },
    '&::before': {
      transition: 'transform 0.6s ease-in, opacity 0.6s ease-in',
      bottom: '130%',
      left: '31%',
      marginLeft: '-11.5px',
      transform: 'rotate(-45deg) translateY(150px)',
      opacity: 0,
      borderColor: theme.palette.error.main,
    },
    '&:hover': {
      transform: 'rotate(3deg)',
      '&::before': {
        height: '10px',
        left: '40%',
        bottom: '124%',
        transform: 'rotate(-30deg)',
      },
    },
  },
}))

function LockComponent({ onUnlock }: { onUnlock?: () => void }) {
  const { classes } = useStyles()
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleLockClick = () => {
    setIsUnlocked(!isUnlocked)
    if (!isUnlocked && onUnlock) onUnlock()
  }

  return (
    <Box className={classes.container}>
      <span
        className={`${classes.lock} ${isUnlocked ? classes.unlocked : ''}`}
        onClick={handleLockClick}
        role='button'
        tabIndex={0}
        aria-label={isUnlocked ? 'Unlock' : 'Lock'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleLockClick()
          }
        }}
        aria-pressed={isUnlocked}
      />
    </Box>
  )
}

export default LockComponent
