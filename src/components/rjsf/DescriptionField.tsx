import Typography from '@mui/material/Typography'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: 5,
    fontFamily: theme.typography.fontFamily,
    fontSize: '14px',
    lineHeight: '20px',
  },
}))

function DescriptionField({ description }: any) {
  const { classes } = useStyles()
  if (description) {
    return (
      <Typography variant='caption' color='text.secondary' className={classes.root}>
        {description}
      </Typography>
    )
  }

  return null
}

export default DescriptionField
