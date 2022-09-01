import { deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, get, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import { extract, isOf } from 'utils/schema'
import CodeEditor from './rjsf/FieldTemplate/CodeEditor'
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
    otomi: { hasCloudLB },
  } = settings
  switch (settingId) {
    case 'otomi':
      unset(schema, 'properties.additionalClusters.items.properties.provider.description')
      break
    case 'cluster':
      unset(schema, 'properties.provider.description')
      unset(schema, 'properties.k8sVersion.description')
      if (provider === 'aws')
        // make region required
        set(schema, 'required', get(schema, 'required', []).concat(['region']))
      else set(schema, 'properties.region.readOnly', true)
      break
    case 'home':
      deleteAlertEndpoints(schema, formData)
      break
    case 'alerts':
      deleteAlertEndpoints(schema, formData)
      break
    case 'azure':
      if (provider !== 'azure') unset(schema, 'properties.azure')
      if (!hasCloudLB) set(schema, 'properties.appgw.readOnly', true)
      if (!appsEnabled.grafana) set(schema, 'properties.monitor.title', 'Azure Monitor (disabled)')
      break
    case 'dns':
      if (formData.provider?.azure || formData.provider?.['azure-private-dns']) {
        const data = formData.provider?.azure || formData.provider?.['azure-private-dns']
        const dataPath = ''
        const path = formData.provider?.azure ? 'properties.provider.oneOf[2]' : 'properties.provider.oneOf[3]'
        const providerPath = formData.provider?.azure
          ? `${path}.properties.azure.properties`
          : `${path}.properties.azure-private-dns.properties`
        const requiredPropsPath = formData.provider?.azure
          ? `${path}.properties.azure.required`
          : `${path}.properties.azure-private-dns.required`
        const requiredProps: string[] = get(schema, requiredPropsPath)
        if (data?.useManagedIdentityExtension) {
          set(schema, `${providerPath}.aadClientId.x-nullMe`, true)
          set(schema, `${providerPath}.aadClientSecret.x-nullMe`, true)
          unset(schema, `${providerPath}.userAssignedIdentityID.x-nullMe`)

          set(
            schema,
            requiredPropsPath,
            requiredProps
              .filter((p) => !['aadClientId', 'aadClientSecret'].includes(p))
              .concat('userAssignedIdentityID'),
          )
        } else {
          set(schema, `${providerPath}.userAssignedIdentityID.x-nullMe`, true)
          unset(schema, `${providerPath}.aadClientId.x-nullMe`)
          unset(schema, `${providerPath}.aadClientSecret.x-nullMe`)
          set(schema, `${requiredPropsPath}`, requiredProps.concat(['aadClientId', 'aadClientSecret']))
        }
      }
      break
    case 'oidc':
      break
    case 'ingress':
      unset(schema, 'properties.platformClass.allOf[1].properties.sourceIpAddressFiltering')
      if (provider !== 'azure') {
        unset(schema, 'properties.platformClass.allOf[1].properties.network')
        unset(schema, 'properties.platformClass.allOf[1].properties.loadBalancerRG')
        unset(schema, 'properties.platformClass.allOf[1].properties.loadBalancerSubnet')
        unset(schema, 'properties.classes.items.allOf[1].properties.network')
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
  formData: any,
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
    ingress: { platformClass: { className: { 'ui:widget': 'hidden' } } },
  }

  if (!appsEnabled.grafana) uiSchema.azure = { monitor: { 'ui:disabled': true } }

  if (!settings.otomi.hasExternalDNS) {
    uiSchema.ingress.classes = {
      'ui:disabled': true,
      'ui:help': 'Hint: Deploy Otomi with your DNS settings to enable this feature.',
    }
  }

  const settingsModel = getSpec().components.schemas.Settings
  const model = settingsModel.properties[settingId]
  if (model) {
    // turn on code editor for fields of type object that don't have any properties
    const leafs = Object.keys(extract(model, (o) => o.type === 'object' && !o.properties && !isOf(o) && !o.nullable))
    leafs.forEach((path) => {
      set(uiSchema, `${settingId}.${path}`, { 'ui:FieldTemplate': CodeEditor })
    })
  }
  return uiSchema[settingId] || {}
}

interface Props extends CrudProps {
  settings: GetSettingsApiResponse
  settingId: string
}

export default function ({ settings: data, settingId, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings } = useSession()
  const [setting, setSetting]: any = useState(data)
  const [schema, setSchema]: any = useState(getSettingSchema(appsEnabled, settings, settingId, setting))
  const [uiSchema, setUiSchema]: any = useState(getSettingUiSchema(appsEnabled, settings, settingId, data))
  useEffect(() => {
    setSetting(data)
    onChangeHandler(data)
  }, [data])
  // END HOOKS
  const onChangeHandler = (data) => {
    setSetting(data)
    const schema = getSettingSchema(appsEnabled, settings, settingId, data)
    const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId, data)
    setSchema(schema)
    setUiSchema(uiSchema)
  }
  return (
    <Form
      key={settingId}
      schema={schema}
      uiSchema={uiSchema}
      data={setting}
      resourceType='Settings'
      onChange={onChangeHandler}
      idProp={null}
      adminOnly
      {...other}
    />
  )
}
