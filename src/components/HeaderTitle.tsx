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
  headTitle: {
    fontSize: '1.5rem',
  },
  headBackground: {
    backgroundColor: theme.palette.background.default,
  },
  headBackgroundAlt: {
    backgroundColor: theme.palette.background.paper,
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
  altColor?: boolean
}
export default function HeaderTitle({
  title,
  description,
  docUrl,
  resourceType,
  altColor,
}: HeaderProps): React.ReactElement {
  const { classes, cx } = useStyles()
  // END HOOKS
  const resourceTypeLow = resourceType.toLowerCase()

  return (
    <>
      <div className={cx(classes.head, altColor ? classes.headBackgroundAlt : classes.headBackground)}>
        <Typography variant='h4' className={classes.headTitle} data-cy={`heading-${resourceTypeLow}`}>
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
