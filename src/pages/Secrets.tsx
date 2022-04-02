import Secrets from 'components/Secrets'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useGetSecretsQuery } from 'redux/otomiApi'
import { k } from 'translations/keys'
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
  const { data, isLoading, error } = useGetSecretsQuery({ teamId })
  const { t } = useTranslation()
  // END HOOKS
  const comp = !(isLoading || error) && data && <Secrets teamId={teamId} secrets={data} />
  return <PaperLayout loading={isLoading} comp={comp} title={t(k.TITLE_SECRETS, { role: getRole(teamId) })} />
}
