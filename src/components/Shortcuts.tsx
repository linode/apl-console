import { Typography } from '@mui/material'
import { capitalize } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetAppApiResponse, GetAppsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import MuiLink from './MuiLink'

const getAppLink = (teamId: string) =>
  function (app: GetAppApiResponse): React.ReactElement {
    const { id } = app
    const path = `/apps/${teamId}/${id}#shortcuts`
    return (
      <RLink to={path} label={id}>
        {capitalize(id)}
      </RLink>
    )
  }

const getShortcutLink = (app) => {
  const {
    baseUrl,
    shortcut: { path, title, description },
    enabled,
  } = app
  const href = `${baseUrl}${path}`
  return enabled !== false ? (
    <MuiLink key={href} href={href} target='_blank' rel='noopener' about={description}>
      <b>{title}</b>: {description}
    </MuiLink>
  ) : (
    <Typography key={href} variant='body2' color='action.disabled'>
      <b>{title}</b>: {description}
    </Typography>
  )
}

interface Props {
  apps: GetAppsApiResponse
  teamId?: string
}

export default function ({ apps, teamId }: Props): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'id',
      label: t('App'),
      renderer: getAppLink(teamId),
    },
    {
      id: 'shortcut.title',
      label: t('Link'),
      renderer: getShortcutLink,
    },
  ]
  return <ListTable teamId={teamId} headCells={headCells} rows={apps} resourceType='Shortcut' noCrud />
}
