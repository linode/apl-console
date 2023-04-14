import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

interface LinkExtendedProps extends LinkProps {
  label?: string
}

export default function (props: LinkExtendedProps): React.ReactElement {
  const { label } = props
  const extra = {}
  if (label) extra['data-cy'] = `link-${label}`
  return <Link {...props} {...extra} />
}
