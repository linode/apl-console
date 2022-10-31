import { Link, LinkProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface LinkExtendedProps extends LinkProps {
  domainSuffix: string
  id?: string
  label?: string
}

export default function ({ domainSuffix, id, label, ...props }: LinkExtendedProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const href = props.href ?? `https://drone.${domainSuffix}/otomi/values/${id}`
  const title = props.title ?? t(`Follow to view build with id {{id}}`, { id })
  const color = props.color ?? 'secondary'
  const insert = { ...props, color, href, title }
  if (label) insert['data-cy'] = `link-drone-${label}`
  return <Link target='_blank' rel='noopener' {...insert} />
}
