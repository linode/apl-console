import { deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { JSONSchema4 } from 'json-schema'
import { cloneDeep, filter, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSettingsInfoApiResponse } from 'redux/otomiApi'
import { extract, isOf } from 'utils/schema'
import InformationBanner from './InformationBanner'
import CodeEditor from './rjsf/FieldTemplate/CodeEditor'
import Form from './rjsf/Form'

export const getSettingSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsInfoApiResponse,
  settingId,
  formData: any,
): any => {
  const schema = cloneDeep(getSpec().components.schemas.Settings.properties[settingId])
  const {
    cluster: { provider },
  } = settings
  switch (settingId) {
    case 'obj':
      if (settings.otomi.isPreInstalled) {
        set(
          schema,
          'properties.provider.oneOf',
          filter((schema as unknown as JSONSchema4).properties.provider.oneOf, (item) => item.title !== 'minioLocal'),
        )
      }
      break
    case 'otomi':
      unset(schema, 'properties.additionalClusters.items.properties.provider.description')
      unset(schema, 'properties.isPreInstalled')
      set(schema, 'properties.adminPassword.readOnly', true)
      break
    case 'cluster':
      unset(schema, 'properties.provider.description')
      set(schema, 'properties.provider.readOnly', true)
      break
    case 'home':
      deleteAlertEndpoints(schema, formData)
      break
    case 'alerts':
      deleteAlertEndpoints(schema, formData)
      break
    case 'dns':
      break
    case 'oidc':
      break
    case 'ingress':
      set(schema, 'properties.platformClass.allOf[0].properties.className', true)
      break
    case 'platformBackups':
      if (!appsEnabled.harbor) set(schema, 'properties.database.properties.harbor.readOnly', true)
      if (settings.otomi.isPreInstalled) unset(schema, 'properties.persistentVolumes')

      break
    default:
      break
  }
  return schema
}

export const getSettingUiSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsInfoApiResponse,
  settingId: string,
): any => {
  const uiSchema: any = {
    cluster: {
      k8sContext: { 'ui:widget': 'hidden' },
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
        age: {
          publicKey: { 'ui:disabled': true },
          privateKey: { 'ui:disabled': true },
        },
      },
    },
    ingress: { platformClass: { className: { 'ui:widget': 'hidden' } } },
  }

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
  settings: GetSettingsInfoApiResponse
  settingId: string
}

export default function ({ settings: data, settingId, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings } = useSession()
  const [setting, setSetting]: any = useState<GetSettingsInfoApiResponse>(data)
  const [schema, setSchema]: any = useState(getSettingSchema(appsEnabled, settings, settingId, setting))
  const [uiSchema, setUiSchema]: any = useState(getSettingUiSchema(appsEnabled, settings, settingId))
  const [disabledMessage, setDisabledMessage] = useState('')
  const removePreInstalledSpecificSettings = ['kms', 'dns', 'ingress']
  let isPreInstalledSetting = false

  if (removePreInstalledSpecificSettings.includes(settingId) && settings.otomi.isPreInstalled)
    isPreInstalledSetting = true

  useEffect(() => {
    onChangeHandler(data)
  }, [data])

  useEffect(() => {
    if (settingId) {
      if (!appsEnabled.alertmanager && settingId === 'alerts')
        setDisabledMessage('Please enable Alertmanager to activate Alerts settings')

      if (!appsEnabled.velero && settingId === 'platformBackups') {
        if (!settings.otomi.isPreInstalled)
          setDisabledMessage('Please enable Velero to activate Persistent volumes backups')
      }

      if (isPreInstalledSetting) setDisabledMessage('These settings are controlled by Linode, they cannot be changed!')
    }
  }, [settingId])
  // END HOOKS
  const getDynamicUiSchema = (data) => {
    if (settingId !== 'alerts') return getSettingUiSchema(appsEnabled, settings, settingId)
    const { receivers } = schema.properties
    const allReceivers = receivers?.items?.enum || []
    const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId)
    const hiddenReceivers = allReceivers.filter((receiver) => !data.receivers?.includes(receiver))
    hiddenReceivers.forEach((receiver) => {
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
        resourceType='Settings'
        onChange={onChangeHandler}
        idProp={null}
        adminOnly
        disabled={isPreInstalledSetting}
        {...other}
      />
    </>
  )
}
