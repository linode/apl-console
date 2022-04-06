import { Typography } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import HelpButton from './HelpButton'

const useStyles = makeStyles()((theme) => ({
  head: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiGrid-item': {
      padding: '16px !important',
    },
  },
  paragraph: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}))

interface HeaderProps {
  title: string
  description?: string
  docUrl?: string
  resourceType: string
}
export default function ({ title, description, docUrl, resourceType }: HeaderProps): React.ReactElement {
  const { classes } = useStyles()
  // END HOOKS
  const resourceTypeLow = resourceType.toLowerCase()

  return (
    <>
      <div className={classes.head}>
        <Typography variant='h4' data-cy={`heading-${resourceTypeLow}`}>
          {title}
        </Typography>
        {docUrl && <HelpButton id='form' size='small' href={`${docUrl}`} />}
      </div>
      {description && (
        <Typography className={classes.paragraph} component='p' variant='body2'>
          {description}
        </Typography>
      )}
    </>
  )
}
