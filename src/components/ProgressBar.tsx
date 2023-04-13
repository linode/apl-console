/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { useHistory } from 'react-router-dom'
// react-router-dom
// @mui
import { useTheme } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'

// ----------------------------------------------------------------------

function ProgressBar() {
  const theme = useTheme()
  const history = useHistory()

  NProgress.configure({ showSpinner: false })

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    history.listen((location, action) => {
      if (action === 'PUSH') handleStart()
      else handleStop()
    })

    return () => {
      history.listen(() => {})
    }
  }, [history])

  return (
    <GlobalStyles
      styles={{
        '#nprogress': {
          pointerEvents: 'none',
          '& .bar': {
            top: 0,
            left: 0,
            height: 2,
            width: '100%',
            position: 'fixed',
            zIndex: theme.zIndex.snackbar,
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 2px ${theme.palette.primary.main}`,
          },
          '& .peg': {
            right: 0,
            opacity: 1,
            width: 100,
            height: '100%',
            display: 'block',
            position: 'absolute',
            transform: 'rotate(3deg) translate(0px, -4px)',
            boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
          },
        },
      }}
    />
  )
}

export default ProgressBar
