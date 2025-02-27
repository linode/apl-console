import { skipToken } from '@reduxjs/toolkit/query/react'
import SealedSecrets from 'components/SealedSecrets'
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
  const {
    data: allSealedSecrets,
    isLoading: isLoadingAllSealedSecrets,
    isFetching: isFetchingAllSealedSecrets,
    refetch: refetchAllSealedSecrets,
  } = useGetAllSealedSecretsQuery(teamId ? skipToken : undefined)
  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSealedSecrets,
    isFetching: isFetchingTeamSealedSecrets,
    refetch: refetchTeamSealedSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllSealedSecrets) refetchAllSealedSecrets()
    else if (teamId && !isFetchingTeamSealedSecrets) refetchTeamSealedSecrets()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllSealedSecrets || isLoadingTeamSealedSecrets
  const sealedSecrets = teamId ? teamSealedSecrets : allSealedSecrets
  const comp = sealedSecrets && <SealedSecrets teamId={teamId} sealedSecrets={sealedSecrets} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SEALEDSECRETS', { role: getRole(teamId) })} />
}
