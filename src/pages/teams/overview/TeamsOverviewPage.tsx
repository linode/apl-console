import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetAplTeamsQuery } from 'redux/otomiApi'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

export default function TeamsOverviewPage(): React.ReactElement {
  const { data, isLoading: isLoadingTeams, isFetching, refetch } = useGetAplTeamsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  const {
    user: { isPlatformAdmin },
  } = useSession()

  useEffect(() => {
    if (isDirty !== false && !isFetching) refetch()
  }, [isDirty])

  const { t } = useTranslation()

  const headCells: HeadCell[] = [
    {
      id: 'metadata.name',
      label: t('Name'),
      renderer: ({ metadata }: any) => {
        const name = metadata?.name ?? ''

        return isPlatformAdmin ? (
          <RLink to={`/teams/${name}`} label={name}>
            {name}
          </RLink>
        ) : (
          name
        )
      },
    },
  ]

  const comp = <ListTable headCells={headCells} rows={data} resourceType='Team' adminOnly hasTeamScope={false} />

  return <PaperLayout loading={isLoadingTeams} comp={comp} title={t('TITLE_TEAMS')} />
}
