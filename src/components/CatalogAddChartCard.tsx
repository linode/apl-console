import { Box, Tooltip, Typography, useTheme } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
      backgroundColor: 'transparent',
      border: `1px dashed #9B9B9B`,
      margin: '5px',
      maxHeight: '200px',
      height: '58px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    img: {
      height: '32px',
      width: '32px',
    },
    chip: {
      height: '20px',
      fontSize: '0.65rem',
      border: 'none',
      borderRadius: '5px',
    },
    chipDark: {
      color: 'rgb(174, 192, 245)',
      backgroundColor: 'lch(77.7 28.7 275 / 0.12)',
    },
    chipLight: {
      color: '#696970',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    link: {
      display: 'flex',
      marginLeft: '5px',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      verticalAlign: 'middle',
      color: theme.palette.text.primary,
      fontWeight: 'bold',
      fontSize: '1rem',
      textTransform: 'capitalize',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }
})

interface Props {
  openNewChartModal: () => void
}

export default function ({ openNewChartModal }: Props): React.ReactElement {
  const { classes, cx } = useStyles()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <Box className={classes.root} onClick={openNewChartModal}>
      <Tooltip title='Click to add a Helm chart'>
        <Typography className={classes.title} variant='h6'>
          + Add Helm chart
        </Typography>
      </Tooltip>
    </Box>
  )
}
