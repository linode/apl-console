import React from 'react'
import { Link, makeStyles, createStyles, Theme, Button, IconButton } from '@material-ui/core'
import HelpRoundedIcon from '@material-ui/icons/HelpRounded'
import Form from '@rjsf/material-ui'
import { FormProps } from '@rjsf/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    helpIcon: {
      marginTop: theme.spacing(3),
      // fontSize: theme.spacing(3),
      // width: theme.spacing(4),
      height: theme.spacing(4),
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
          <Button
            size='large'
            className={classes.helpIcon}
            startIcon={<HelpRoundedIcon />}
            variant='contained'
            color='primary'
            aria-label='Read the documentation'
            data-cy='button-help'
            href={`${docUrl}`}
          >
            Help
          </Button>
        )}
      </div>
      <Form {...props}>{children}</Form>
    </>
  )
}
