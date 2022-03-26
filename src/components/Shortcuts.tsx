import { Typography } from '@mui/material'
import { capitalize } from 'lodash'
import React from 'react'
import { GetAppsApiResponse } from 'store/otomi'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'

const getAppLink = (teamId: string) =>
  function (app): React.ReactElement {
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
    <MuiLink key={href} href={href} target='_blank' rel='noopener' label={title} about={description}>
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
  const headCells: HeadCell[] = [
    {
      id: 'id',
      label: 'App',
      renderer: getAppLink(teamId),
    },
    {
      id: 'shortcut.title',
      label: 'Link',
      renderer: getShortcutLink,
    },
  ]
  return (
    <>
      <h1 data-cy='h1-shortcuts-page'>{`Shortcuts${teamId !== 'admin' ? ` (team ${teamId})` : ' (admin)'}`}</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='id' rows={apps} idKey='description' />
    </>
  )
}
