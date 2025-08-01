import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetTeamsQuery } from 'redux/otomiApi'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

export default function TeamsOverviewPage(): React.ReactElement {
  const { data, isLoading: isLoadingTeams, isFetching, refetch } = useGetTeamsQuery()
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
      id: 'name',
      label: t('Name'),
      renderer: ({ name }: any) =>
        isPlatformAdmin ? (
          <RLink to={`/teams/${name}`} label={name}>
            {name}
          </RLink>
        ) : (
          name
        ),
    },
  ]
  // END HOOKS
  const comp = <ListTable headCells={headCells} rows={data} resourceType='Team' adminOnly hasTeamScope={false} />
  return <PaperLayout loading={isLoadingTeams} comp={comp} title={t('TITLE_TEAMS')} />
}
