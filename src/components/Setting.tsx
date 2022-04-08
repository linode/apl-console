import { deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React from 'react'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSettingSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  settingId,
  formData: any,
): any => {
  const schema = cloneDeep(getSpec().components.schemas.Settings.properties[settingId]) as JSONSchema7
  const {
    cluster: { provider },
  } = settings
  switch (settingId) {
    case 'home':
      deleteAlertEndpoints(schema, formData)
      break
    case 'alerts':
      deleteAlertEndpoints(schema, formData)
      break
    case 'azure':
      if (provider !== 'azure') unset(schema, 'properties.azure')
      if (!appsEnabled.grafana) set(schema, 'properties.monitor.title', 'Azure Monitor (disabled)')
      break
    case 'dns':
      if (formData.provider?.azure?.useManagedIdentityExtension) {
        unset(schema, 'properties.provider.oneOf[2].properties.azure.properties.aadClientId')
        unset(schema, 'properties.provider.oneOf[2].properties.azure.properties.aadClientSecret')
      } else {
        unset(schema, 'properties.provider.oneOf[2].properties.azure.properties.userAssignedIdentityID')
        set(schema, 'properties.provider.oneOf[2].properties.azure.required', ['aadClientId', 'aadClientSecret'])
      }
      break
    case 'oidc':
      break
    default:
      break
  }
  return schema
}

export const getSettingUiSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  settingId: string,
): any => {
  const uiSchema: any = {
    kms: {
      sops: {
        provider: { 'ui:widget': 'hidden' },
        google: {
          accountJson: { 'ui:widget': 'textarea' },
        },
      },
    },
  }
  if (!appsEnabled.grafana) uiSchema.azure = { monitor: { 'ui:disabled': true } }

  return uiSchema[settingId] || {}
}

interface Props extends CrudProps {
  settings: any
  settingId: string
}

export default function ({ settings: data, settingId, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings } = useSession()
  // END HOOKS
  const schema = getSettingSchema(appsEnabled, settings, settingId, data)
  // we provide oboTeamId (not teamId) when a resource is only allowed edits by admin:
  const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId)
  return (
    <Form
      key={settingId}
      schema={schema}
      uiSchema={uiSchema}
      data={data}
      resourceType='Settings'
      idProp={null}
      adminOnly
      {...other}
    />
  )
}
