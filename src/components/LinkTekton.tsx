import { Link, LinkProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface LinkExtendedProps extends LinkProps {
  domainSuffix: string
  order?: string
  name?: string
  label?: string
}

export default function ({ domainSuffix, order, name, label, ...props }: LinkExtendedProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const href =
    props.href ??
    `https://tekton.${domainSuffix}/#/namespaces/otomi-pipelines/pipelineruns/${name}?pipelineTask=otomi-git-clone`
  const title = props.title ?? t(`Follow to view build {{order}}`, { order })
  const color = props.color ?? 'secondary'
  const insert = { ...props, color, href, title }
  if (label) insert['data-cy'] = `link-drone-${label}`
  return <Link target='_blank' rel='noopener' {...insert} />
}
