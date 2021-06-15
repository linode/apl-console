import React from 'react'
import { FieldProps } from '@rjsf/core'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    marginTop: 5,
  },
})

const DescriptionField = ({ description }: FieldProps) => {
  const classes = useStyles()
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
