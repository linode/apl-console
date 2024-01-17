import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSealedSecretApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSecretSchema = (teamId: string, formData: any): any => {
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

export const getSecretUiSchema = (user: GetSessionApiResponse['user'], teamId: string, formData: any): any => {
  const addable = formData?.type ? formData?.type === 'kubernetes.io/opaque' : true
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

const typeToEncryptedDataMap = {
  'kubernetes.io/opaque': [{ key: '' }],
  'kubernetes.io/service-account-token': [{ key: 'extra' }],
  'kubernetes.io/dockercfg': [{ key: '.dockercfg' }],
  'kubernetes.io/dockerconfigjson': [{ key: 'dockerconfigjson' }],
  'kubernetes.io/basic-auth': [{ key: 'username' }, { key: 'password' }],
  'kubernetes.io/ssh-auth': [{ key: 'ssh-privatekey' }],
  'kubernetes.io/tls': [{ key: 'tls.crt' }, { key: 'tls.key' }],
}

const updateEncryptedDataFields = (formData: any): any => {
  if (!formData?.type) return
  formData.encryptedData = typeToEncryptedDataMap[formData.type] || [{ key: '' }]
}

interface Props extends CrudProps {
  teamId: string
  secret?: GetSealedSecretApiResponse
}

export default function ({ secret, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(secret)
  useEffect(() => {
    setData(secret)
  }, [secret])
  // END HOOKS
  const formData = cloneDeep(data)
  useEffect(() => {
    updateEncryptedDataFields(formData)
  }, [formData?.type])
  const schema = getSecretSchema(teamId, formData)
  const uiSchema = getSecretUiSchema(user, teamId, formData)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.vault}
      resourceType='SealedSecret'
      {...other}
    />
  )
}
