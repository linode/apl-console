import React from 'react'
import Typography from '@mui/material/Typography'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  root: {
    marginTop: 5,
  },
}))

const DescriptionField = ({ description }: any) => {
  const { classes } = useStyles()
  if (description) {
    return (
      <Typography variant='caption' color='textSecondary' className={classes.root}>
        {description}
      </Typography>
    )
  }

  return null
}

export default DescriptionField
