import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetBackupApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getBackupSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Backup)
  return schema
}

export const getBackupUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'backup')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  backup?: GetBackupApiResponse
}

export default function ({ backup, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(backup)
  useEffect(() => {
    setData(backup)
  }, [backup])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getBackupSchema(teamId)
  const uiSchema = getBackupUiSchema(user, teamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.argocd}
      resourceType='Backup'
      {...other}
    />
  )
}
