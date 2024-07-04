import { Box } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  root: {
    // paddingTop: theme.spacing(2),
  },
}))

export default function ({ children, value, index, ...other }: any): React.ReactElement {
  const { classes } = useStyles()
  return (
    <div
      className={classes.root}
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}
