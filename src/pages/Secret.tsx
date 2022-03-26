/* eslint-disable @typescript-eslint/no-floating-promises */
import Secret from 'components/Secret'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useCreateSecretMutation, useDeleteSecretMutation, useEditSecretMutation, useGetSecretQuery } from 'store/otomi'

interface Params {
  teamId?: string
  secretId: string
}

export default function ({
  match: {
    params: { teamId, secretId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const { data, isLoading, error } = useGetSecretQuery({ teamId, secretId })
  const [create, { isSuccess: createOk }] = useCreateSecretMutation()
  const [update, { isSuccess: updateOk }] = useEditSecretMutation()
  const [del, { isSuccess: deleteOk }] = useDeleteSecretMutation()
  // END HOOKS
  if (formData) {
    if (secretId) update({ teamId, secretId, body: omit(formData, ['id']) as any })
    else create({ teamId, body: omit(formData, ['id', 'teamId']) as any })
    setFormData(undefined)
  }
  if (deleteId) {
    del({ teamId, secretId })
    setDeleteId()
  }
  if ([createOk, updateOk, deleteOk].some((c) => c)) return <Redirect to={`/teams/${teamId}/secrets`} />
  const secret = formData || data
  const comp = !(isLoading || error) && <Secret onSubmit={setFormData} secret={secret} onDelete={setDeleteId} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
