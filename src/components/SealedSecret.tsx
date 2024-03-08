import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSealedSecretApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSecretSchema = (teamId: string, formData: SealedSecret): any => {
  const schema = cloneDeep(getSpec().components.schemas.SealedSecret)
  if (teamId !== 'admin') delete schema.properties.namespace
  set(schema, 'properties.type.listNotShort', true)
  set(
    schema,
    'properties.encryptedData.items.properties.key.readOnly',
    formData?.type && formData?.type !== 'kubernetes.io/opaque',
  )
  return schema
}

export const getSecretUiSchema = (user: GetSessionApiResponse['user'], teamId: string, formData: SealedSecret): any => {
  const addable = formData?.type ? formData.type === 'kubernetes.io/opaque' : true
  const dockerconfigjson = formData?.type === 'kubernetes.io/dockerconfigjson'
  const jsonexample = {
    auths: {
      'my-registry.example:5000': {
        username: 'tiger',
        password: 'pass1234',
        email: 'tiger@acme.example',
        auth: 'dGlnZXI6cGFzczEyMzQ=',
      },
    },
  }
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': formData?.id },
    type: { 'ui:readonly': formData?.id },
    encryptedData: {
      'ui:options': {
        removable: formData?.type === 'kubernetes.io/opaque' && formData?.encryptedData?.length > 1,
        addable,
      },
      ...(dockerconfigjson && {
        items: {
          value: { 'ui:widget': 'textarea', 'ui:description': `${JSON.stringify(jsonexample)}` },
        },
      }),
    },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'secret')

  return uiSchema
}

const encryptedDataMap = {
  'kubernetes.io/opaque': [{ key: '' }],
  'kubernetes.io/service-account-token': [{ key: 'extra' }],
  'kubernetes.io/dockercfg': [{ key: '.dockercfg' }],
  'kubernetes.io/dockerconfigjson': [{ key: '.dockerconfigjson' }],
  'kubernetes.io/basic-auth': [{ key: 'username' }, { key: 'password' }],
  'kubernetes.io/ssh-auth': [{ key: 'ssh-privatekey' }],
  'kubernetes.io/tls': [{ key: 'tls.crt' }, { key: 'tls.key' }],
}

interface Props extends CrudProps {
  teamId: string
  secret?: GetSealedSecretApiResponse
}

interface SealedSecret extends GetSealedSecretApiResponse {
  isDisabled?: boolean
}

export default function ({ secret, teamId, ...other }: Props): React.ReactElement {
  const { user } = useSession()
  const [data, setData] = useState<SealedSecret>(secret)
  useEffect(() => {
    setData(secret)
  }, [secret])

  useEffect(() => {
    if (data?.id) return
    setData((prev: any) => {
      if (!prev?.type) return prev
      const data = { ...prev }
      data.encryptedData = encryptedDataMap[data.type] || [{ key: '' }]
      return data
    })
  }, [data?.type])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getSecretSchema(teamId, formData)
  const uiSchema = getSecretUiSchema(user, teamId, formData)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={formData?.isDisabled}
      resourceType='SealedSecret'
      {...other}
    />
  )
}
