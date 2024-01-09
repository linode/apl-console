import SealedSecrets from 'components/SealedSecrets'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllSealedSecretsQuery, useGetSealedSecretsQuery } from 'redux/otomiApi'
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
  const {
    data: allSecrets,
    isLoading: isLoadingAllSecrets,
    isFetching: isFetchingAllSecrets,
    refetch: refetchAllSecrets,
  } = useGetAllSealedSecretsQuery()
  const {
    data: teamSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllSecrets) refetchAllSecrets()
    else if (teamId && !isFetchingTeamSecrets) refetchTeamSecrets()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllSecrets || isLoadingTeamSecrets
  const secrets = teamId ? teamSecrets : allSecrets
  const comp = secrets && <SealedSecrets teamId={teamId} secrets={secrets} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SEALEDSECRETS', { role: getRole(teamId) })} />
}
