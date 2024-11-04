import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Props {
  teams: GetTeamsApiResponse
}

export default function ({ teams }: Props): React.ReactElement {
  const {
    user: { isPlatformAdmin },
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: ({ id }: any) =>
        isPlatformAdmin ? (
          <RLink to={`/teams/${id}`} label={id}>
            {id}
          </RLink>
        ) : (
          id
        ),
    },
  ]

  return <ListTable headCells={headCells} rows={teams} resourceType='Team' adminOnly hasTeamScope={false} />
}
