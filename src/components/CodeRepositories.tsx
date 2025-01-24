/* eslint-disable no-nested-ternary */
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetAllCodereposApiResponse, GetTeamCodereposApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

const getCodeRepoLink = (isAdmin, ownerId): CallableFunction =>
  function (row): string | React.ReactElement {
    const { teamId, id, name }: { teamId: string; id: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name
    const path = `/teams/${teamId}/code-repositories/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

interface Props {
  coderepos: GetAllCodereposApiResponse | GetTeamCodereposApiResponse
  teamId?: string
}

// TODO: https://github.com/redkubes/otomi-core/discussions/475
export default function ({ coderepos, teamId }: Props): React.ReactElement {
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getCodeRepoLink(isPlatformAdmin, oboTeamId),
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }
  return <ListTable teamId={teamId} headCells={headCells} rows={coderepos} resourceType='CodeRepository' />
}
