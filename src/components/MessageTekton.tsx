import { LinkProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import LinkCommit from './LinkCommit'
import MessageTrans from './MessageTrans'
import LinkTekton from './LinkTekton'

interface LinkExtendedProps extends LinkProps {
  datetime: string
  domainSuffix: string
  order: string
  name: string
  repo?: string
  sha: string
  short?: boolean
  status?: string
}

export default function ({
  datetime,
  domainSuffix,
  order,
  name,
  repo,
  sha,
  short,
  status,
  ...props
}: LinkExtendedProps): React.ReactElement {
  const { t } = useTranslation()
  const color: LinkProps['color'] = 'secondary'
  const commit = { ...props, color, domainSuffix, repo, sha, short }
  const tekton = { ...props, color, datetime, domainSuffix, order, name }
  const data = { datetime, order, sha, status }
  return (
    <div data-cy={`drone-${status}-message`} style={{ whiteSpace: 'pre-wrap' }}>
      <MessageTrans i18nKey='TEKTON_MESSAGE' t={t} {...data}>
        Tekton <LinkTekton {...tekton}>build {{ order }}</LinkTekton> <strong>{{ status }}</strong> for commit{' '}
        <LinkCommit {...commit}>{{ sha }}</LinkCommit> at {{ datetime }}.
      </MessageTrans>
    </div>
  )
}
