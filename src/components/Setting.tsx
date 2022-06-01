import { deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, get, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
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
    case 'cluster':
      if (provider === 'aws')
        // make region required
        set(schema, 'required', get(schema, 'required', []).concat(['region']))
      else unset(schema, 'properties.region')
      break
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
    case 'ingress':
      if (provider !== 'azure') {
        unset(schema, 'properties.platformClass.allOf[1].properties.loadBalancerRG')
        unset(schema, 'properties.platformClass.allOf[1].properties.loadBalancerRG')
        unset(schema, 'properties.platformClass.allOf[1].properties.loadBalancerSubnet')
        unset(schema, 'properties.classes.items.allOf[1].properties.loadBalancerRG')
        unset(schema, 'properties.classes.items.allOf[1].properties.loadBalancerSubnet')
      }

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
    cluster: {
      k8sContext: { 'ui:widget': 'hidden' },
    },
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

  if (!settings.otomi.hasExternalDNS) {
    uiSchema.ingress = {
      classes: {
        'ui:disabled': true,
        'ui:help': 'Hint: Deploy Otomi with your DNS settings to enable this feature.',
      },
    }
  }

  if (!['google', 'azure', 'aws', 'custom'].includes(settings.cluster.provider)) {
    uiSchema.ingress = {
      platformClass: {
        network: {
          'ui:disabled': true,
          'ui:help': 'Hint: This feature is available only for cluster providers that support private Load Blancers',
        },
      },
    }
  }

  return uiSchema[settingId] || {}
}

interface Props extends CrudProps {
  settings: any
  settingId: string
}

export default function ({ settings: data, settingId, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings } = useSession()
  const [setting, setSetting]: any = useState(data)
  useEffect(() => {
    setSetting(data)
  }, [data])
  // END HOOKS
  const schema = getSettingSchema(appsEnabled, settings, settingId, setting)
  // we provide oboTeamId (not teamId) when a resource is only allowed edits by admin:
  const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId)
  return (
    <Form
      key={settingId}
      schema={schema}
      uiSchema={uiSchema}
      data={setting}
      resourceType='Settings'
      onChange={setSetting}
      idProp={null}
      adminOnly
      {...other}
    />
  )
}
