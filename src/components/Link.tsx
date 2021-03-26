import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { mainStyles } from '../theme'

interface LinkExtendedProps extends LinkProps {
  label: string
}

export default (props: LinkExtendedProps): React.ReactElement => {
  const { label } = props
  return <Link {...props} className={mainStyles().selectable} data-cy={`link-${label}`} />
}
