/* eslint-disable @typescript-eslint/no-floating-promises */
import Secret from 'components/Secret'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  useCreateSecretMutation,
  useDeleteSecretMutation,
  useEditSecretMutation,
  useGetSecretQuery,
} from 'redux/otomiApi'
import { k } from 'translations/keys'

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
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [create, { isLoading: isLoadingCreate, isSuccess: okCreate, status: statusCreate }] = useCreateSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: okUpdate, status: statusUpdate }] = useEditSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: okDelete, status: statusDelete }] = useDeleteSecretMutation()
  const { data, isLoading, error } = useGetSecretQuery(
    { teamId, secretId },
    { skip: !secretId || isLoadingCreate || isLoadingUpdate || isLoadingDelete || okCreate || okUpdate || okDelete },
  )
  useEffect(() => {
    if (formData) {
      setFormData(undefined)
      if (secretId) update({ teamId, secretId, body: omit(formData, ['id', 'teamId']) as any })
      else create({ teamId, body: formData as any })
    }
    if (deleteId) {
      setDeleteId()
      del({ teamId, secretId })
    }
  }, [formData, deleteId])
  const { t } = useTranslation()
  // END HOOKS
  if (okDelete || okCreate || okUpdate) return <Redirect to={`/teams/${teamId}/secrets`} />
  const secret = formData || data
  const comp = !(isLoading || error) && <Secret onSubmit={setFormData} secret={secret} onDelete={setDeleteId} />
  return <PaperLayout loading={isLoading} comp={comp} title={t(k.TITLE_SECRET, { secretId, role: 'team' })} />
}
