import { skipToken } from '@reduxjs/toolkit/dist/query'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'
import { useGetAllCodereposQuery, useGetTeamCodereposQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

const getCodeRepoLabel = (): CallableFunction =>
  function (row): string | React.ReactElement {
    const { teamId, id, name }: { teamId: string; id: string; name: string } = row
    const path = `/teams/${teamId}/coderepositories/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

const getCodeRepoUrl = (): CallableFunction =>
  function (row): string | React.ReactElement {
    const { url }: { url: string } = row
    return (
      <a href={url} target='_blank' rel='noopener noreferrer'>
        {url}
      </a>
    )
  }

const getIcon = (): CallableFunction =>
  function (row): string | React.ReactElement {
    const { type }: { type: string } = row
    return (
      <img
        style={{ width: 24, height: 24 }}
        src={`/logos/${type}_logo.svg`}
        onError={({ currentTarget }) => {
          // eslint-disable-next-line no-param-reassign
          currentTarget.onerror = null // prevents looping
          // eslint-disable-next-line no-param-reassign
          currentTarget.src = `${type}_logo.svg`
        }}
        alt={`Logo for ${type}`}
      />
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
      renderer: getCodeRepoLabel(),
    },
    {
      id: 'url',
      label: t('URL'),
      renderer: getCodeRepoUrl(),
    },
    {
      id: 'gitservice',
      label: t('Git Service'),
      renderer: getIcon(),
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
