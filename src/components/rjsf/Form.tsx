import React from 'react'
import { Link, makeStyles, createStyles, Theme } from '@material-ui/core'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'
import Form from '@rjsf/material-ui'
import { FormProps } from '@rjsf/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    link: {
      // display: 'flex',
      float: 'right',
    },
    helpIcon: {
      margin: theme.spacing(1),
      fontSize: theme.spacing(5),
      height: theme.spacing(5),
    },
  }),
)

interface Props extends FormProps<any> {
  title: any
}

export default ({ children, title, ...props }: Props) => {
  const { schema } = props
  const docUrl = schema['x-externalDocsPath'] && `https://redkubes.github.io/${schema['x-externalDocsPath']}`
  const classes = useStyles()
  return (
    <>
      <div className={classes.root}>
        {title}
        {docUrl && (
          <Link className={classes.helpIcon} aria-label='Go to the documentation' href={`${docUrl}`}>
            <HelpRoundedIcon className={classes.helpIcon} />
          </Link>
        )}
      </div>
      <Form {...props}>{children}</Form>
    </>
  )
}
