import React from 'react'
import { FieldProps } from '@rjsf/core'
import Typography from '@mui/material/Typography'
import { makeStyles } from 'common/theme'

const useStyles = makeStyles()(() => ({
  root: {
    marginTop: 5,
  },
}))

const DescriptionField = ({ description }: FieldProps) => {
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
