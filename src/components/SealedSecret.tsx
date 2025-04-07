import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSealedSecretApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import { Box } from '@mui/material'
import Form from './rjsf/Form'
import InformationBanner from './InformationBanner'

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
  const tls = formData?.type === 'kubernetes.io/tls'
  const description =
    'The secret value will only be visible at the time of creation or once it has been successfully synchronized with the cluster.'
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
    isDisabled: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': formData?.id },
    type: { 'ui:readonly': formData?.id },
    encryptedData: {
      'ui:options': {
        removable: formData?.type === 'kubernetes.io/opaque' && formData?.encryptedData?.length > 1,
        addable,
      },
      items: {
        value: {
          'ui:description': description,
        },
      },
      ...(dockerconfigjson && {
        items: {
          value: { 'ui:widget': 'textarea', 'ui:description': `${JSON.stringify(jsonexample)}` },
        },
      }),
      ...(tls && {
        items: {
          value: {
            'ui:widget': 'textarea',
            'ui:description': description,
          },
        },
      }),
      // default and opaque input field type is textarea
      ...(addable && {
        items: {
          value: {
            'ui:widget': 'textarea',
            'ui:description': description,
          },
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
  isCoderepository?: boolean
}

interface SealedSecret extends GetSealedSecretApiResponse {
  isDisabled?: boolean
}

export default function ({ secret, teamId, isCoderepository, ...other }: Props): React.ReactElement {
  const { user } = useSession()
  const [data, setData] = useState<SealedSecret>(secret)
  useEffect(() => {
    setData(secret)
  }, [secret])

  useEffect(() => {
    if (secret?.name) return
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
    <Box>
      {isCoderepository && (
        <InformationBanner message='Please make sure to create a "basic-auth" or "ssh-auth" type Sealed Secret for the private code repository.' />
      )}
      <Form
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onChange={setData}
        disabled={formData?.isDisabled}
        resourceType='SealedSecret'
        {...other}
      />
    </Box>
  )
}
