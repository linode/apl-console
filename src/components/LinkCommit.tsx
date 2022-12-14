import { Link, LinkProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface LinkExtendedProps extends LinkProps {
  domainSuffix?: string
  label?: string
  repo?: string
  sha: string
  short?: boolean
}

export default function ({ domainSuffix, label, sha, short = true, ...props }: LinkExtendedProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const repo = props.repo ?? `https://gitea.${domainSuffix}/otomi/values`
  const href = props.href ?? `${repo.replace('.git', '')}/commit/${sha}`
  const shaShort = sha?.substring(0, 8)
  const children = props.children ?? short ? shaShort : sha
  const title = props.title ?? t(`Follow to view commit with sha {{sha}}`, { sha })
  const color = props.color ?? 'secondary'
  const insert = { ...props, children, color, href, repo, title }
  if (label) insert['data-cy'] = `link-commit-${label}`
  return (
    <Link target='_blank' rel='noopener' {...insert}>
      {children}
    </Link>
  )
}
