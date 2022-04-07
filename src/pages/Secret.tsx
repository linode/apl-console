/* eslint-disable @typescript-eslint/no-floating-promises */
import Secret from 'components/Secret'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import {
  useCreateSecretMutation,
  useDeleteSecretMutation,
  useEditSecretMutation,
  useGetSecretQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  secretId?: string
}

export default function ({
  match: {
    params: { teamId, secretId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [create] = useCreateSecretMutation()
  const [update] = useEditSecretMutation()
  const [del] = useDeleteSecretMutation()
  const { data, isLoading } = useGetSecretQuery({ teamId, secretId }, { skip: !secretId })
  const { t } = useTranslation()
  // END HOOKS
  const handleSubmit = (formData) => {
    if (secretId) update({ teamId, secretId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, secretId: deleteId })
  const comp = <Secret onSubmit={handleSubmit} secret={data} onDelete={handleDelete} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SECRET', { secretId, role: 'team' })} />
}
