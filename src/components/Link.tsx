import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { useMainStyles } from 'common/theme'

interface LinkExtendedProps extends LinkProps {
  label: string
}

export default (props: LinkExtendedProps): React.ReactElement => {
  const { label } = props
  const { classes } = useMainStyles()
  return <Link {...props} className={classes.selectable} data-cy={`link-${label}`} />
}
