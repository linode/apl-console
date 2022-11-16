import Secrets from 'components/Secrets'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetSecretsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const { data, isLoading, isFetching, refetch } = useGetSecretsQuery({ teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false && !isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const comp = data && <Secrets teamId={teamId} secrets={data} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SECRETS', { role: getRole(teamId) })} />
}
