import { skipToken } from '@reduxjs/toolkit/dist/query'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'
import { useSession } from 'providers/Session'
import { useGetAllCodereposQuery, useGetTeamCodereposQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

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

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = useSession()

  const {
    data: allCodeRepositories,
    isLoading: isLoadingAllCodeRepositories,
    isFetching: isFetchingAllCodeRepositories,
    refetch: refetchAllCodeRepositories,
  } = useGetAllCodereposQuery(teamId ? skipToken : undefined)
  const {
    data: teamCodeRepositories,
    isLoading: isLoadingTeamCodeRepositories,
    isFetching: isFetchingTeamCodeRepositories,
    refetch: refetchTeamCodeRepositories,
  } = useGetTeamCodereposQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllCodeRepositories) refetchAllCodeRepositories()
    else if (teamId && !isFetchingTeamCodeRepositories) refetchTeamCodeRepositories()
  }, [isDirty])

  const loading = isLoadingAllCodeRepositories || isLoadingTeamCodeRepositories
  const coderepos = teamId ? teamCodeRepositories : allCodeRepositories

  const headCells: HeadCell[] = [
    {
      id: 'label',
      label: t('Label'),
      renderer: getCodeRepoLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'url',
      label: t('URL'),
      renderer: getCodeRepoLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'gitservice',
      label: t('Git Service'),
      renderer: getCodeRepoLink(isPlatformAdmin, oboTeamId),
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  const comp = <ListTable teamId={teamId} headCells={headCells} rows={coderepos} resourceType='CodeRepository' />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_CODEREPOSITORIES', { scope: getRole(teamId) })} />
}
