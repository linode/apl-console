import { deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { JSONSchema4 } from 'json-schema'
import { cloneDeep, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import { extract, isOf } from 'utils/schema'
import InformationBanner from './InformationBanner'
import CodeEditor from './rjsf/FieldTemplate/CodeEditor'
import Form from './rjsf/Form'

export const getSettingSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  settingId,
  formData: any,
): any => {
  const schema = cloneDeep(getSpec().components.schemas.Settings.properties[settingId])
  const {
    cluster: { provider },
    otomi: { hasCloudLB },
  } = settings
  switch (settingId) {
    case 'otomi':
      unset(schema, 'properties.additionalClusters.items.properties.provider.description')
      set(schema, 'properties.adminPassword.readOnly', true)
      set(schema, 'properties.adminPassword.x-formtype', formData.showPassword ? 'text' : 'password')
      set(
        schema,
        'properties.globalPullSecret.properties.password.x-formtype',
        formData?.globalPullSecret?.showPassword ? 'text' : 'password',
      )
      break
    case 'cluster':
      unset(schema, 'properties.provider.description')
      set(schema, 'properties.provider.readOnly', true)
      unset(schema, 'properties.k8sVersion.description')
      set(schema, 'properties.k8sVersion.readOnly', true)
      if (provider === 'aws')
        // make region required
        set(schema, 'required', (schema.required ?? []).concat(['region']))
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
      break
    case 'oidc':
      break
    case 'ingress':
      set(schema, 'properties.platformClass.allOf[0].properties.className', true)
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
): any => {
  const uiSchema: any = {
    cluster: {
      k8sContext: { 'ui:widget': 'hidden' },
      // TODO: check out why we need this:
      name: { 'ui:autofocus': true }, // hack to bypass losing focus when typing in this field
    },
    otomi: {
      isMultitenant: { 'ui:widget': 'hidden' },
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
    const leafs = Object.keys(
      extract(model, (o: JSONSchema4) => o.type === 'object' && !o.properties && !isOf(o) && !o.nullable),
    )
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
  const [setting, setSetting]: any = useState<GetSettingsApiResponse>(data)
  const [schema, setSchema]: any = useState(getSettingSchema(appsEnabled, settings, settingId, setting))
  const [uiSchema, setUiSchema]: any = useState(getSettingUiSchema(appsEnabled, settings, settingId))
  const [disabledMessage, setDisabledMessage] = useState('')
  useEffect(() => {
    onChangeHandler(data)
  }, [data])

  useEffect(() => {
    if (settingId) {
      if (!appsEnabled.alertmanager && settingId === 'alerts')
        setDisabledMessage('Please enable Alertmanager to activate Alerts settings')

      if (!appsEnabled.alertmanager && settingId === 'home')
        setDisabledMessage('Please enable Alertmanager to activate Co-monitoring')

      if (!appsEnabled.velero && settingId === 'platformBackups')
        setDisabledMessage('Please enable Velero to activate Backups')
    }
  }, [settingId])
  // END HOOKS
  const getDynamicUiSchema = (data) => {
    if (settingId !== 'alerts') return getSettingUiSchema(appsEnabled, settings, settingId)
    const { receivers, drone } = schema.properties
    const allItems = [...new Set([...receivers.items.enum, ...drone.items.enum])]
    const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId)
    const diff = allItems.filter((receiver) => !data.receivers?.includes(receiver) && !data.drone?.includes(receiver))
    diff.forEach((receiver) => {
      uiSchema[receiver] = { 'ui:widget': 'hidden' }
    })
    return uiSchema
  }
  const onChangeHandler = (data) => {
    const schema = getSettingSchema(appsEnabled, settings, settingId, data)
    setSetting(data)
    setSchema(schema)
    setUiSchema(getDynamicUiSchema(data))
  }

  return (
    <>
      {disabledMessage && <InformationBanner message={disabledMessage} />}

      <Form
        key={settingId}
        schema={schema}
        uiSchema={uiSchema}
        data={setting}
        disabled={!!disabledMessage}
        resourceType='Settings'
        onChange={onChangeHandler}
        idProp={null}
        adminOnly
        {...other}
      />
    </>
  )
}
