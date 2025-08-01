import { skipToken } from '@reduxjs/toolkit/dist/query'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'
import { useGetAllCodeReposQuery, useGetTeamCodeReposQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

const getCodeRepoName = (): CallableFunction =>
  function (row): string | React.ReactElement {
    const { teamId, name }: { teamId: string; name: string } = row
    const path = `/teams/${teamId}/code-repositories/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

const getCodeRepoUrl = (): CallableFunction =>
  function (row): string | React.ReactElement {
    const { repositoryUrl }: { repositoryUrl: string } = row
    return (
      <a href={repositoryUrl} target='_blank' rel='noopener noreferrer'>
        {repositoryUrl}
      </a>
    )
  }

const getIcon = (): CallableFunction =>
  function (row): string | React.ReactElement {
    const { gitService }: { gitService: string } = row
    return (
      <img
        style={{ width: 24, height: 24 }}
        src={`/logos/${gitService}_logo.svg`}
        onError={({ currentTarget }) => {
          // eslint-disable-next-line no-param-reassign
          currentTarget.onerror = null // prevents looping
          // eslint-disable-next-line no-param-reassign
          currentTarget.src = `${gitService}_logo.svg`
        }}
        alt={`Logo for ${gitService}`}
      />
    )
  }

interface Params {
  teamId?: string
}

export default function CodeRepositoriesOverviewPage({
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
  } = useGetAllCodeReposQuery(teamId ? skipToken : undefined)
  const {
    data: teamCodeRepositories,
    isLoading: isLoadingTeamCodeRepositories,
    isFetching: isFetchingTeamCodeRepositories,
    refetch: refetchTeamCodeRepositories,
  } = useGetTeamCodeReposQuery({ teamId }, { skip: !teamId })
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
      id: 'name',
      label: t('Name'),
      renderer: getCodeRepoName(),
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

  const customButtonText = () => <span>Add Code Repository</span>

  const comp = (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={coderepos}
      resourceType='Code-repository'
      customButtonText={customButtonText()}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_CODE_REPOSITORIES', { scope: getRole(teamId) })} />
}
