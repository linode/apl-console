import { LinkProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import LinkCommit from './LinkCommit'
import LinkDrone from './LinkDrone'
import MessageTrans from './MessageTrans'

interface LinkExtendedProps extends LinkProps {
  datetime: string
  domainSuffix: string
  id: string
  repo?: string
  sha: string
  short?: boolean
  status?: string
}

export default function ({
  datetime,
  domainSuffix,
  id,
  repo,
  sha,
  short,
  status,
  ...props
}: LinkExtendedProps): React.ReactElement {
  const { t } = useTranslation()
  const color: LinkProps['color'] = 'secondary'
  const commit = { ...props, color, domainSuffix, repo, sha, short }
  const drone = { ...props, color, datetime, domainSuffix, id }
  const data = { datetime, id, sha, status }
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      <MessageTrans i18nKey='DRONE_MESSAGE' t={t} {...data}>
        Drone <LinkDrone {...drone}>build {{ id }}</LinkDrone> <strong>{{ status }}</strong> for commit{' '}
        <LinkCommit {...commit}>{{ sha }}</LinkCommit> at {{ datetime }}.
      </MessageTrans>
    </div>
  )
}
