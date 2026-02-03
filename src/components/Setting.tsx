import { deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { JSONSchema4 } from 'json-schema'
import { cloneDeep, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSettingsInfoApiResponse } from 'redux/otomiApi'
import { extract, isOf } from 'utils/schema'
import { Button } from '@mui/material'
import { useLocalStorage } from 'react-use'
import { useHistory } from 'react-router-dom'
import InformationBanner from './InformationBanner'
import CodeEditor from './rjsf/FieldTemplate/CodeEditor'
import Form from './rjsf/Form'

export const getSettingSchema = (appsEnabled: Record<string, any>, settingId, formData: any): any => {
  const schema = cloneDeep(getSpec().components.schemas.Settings.properties[settingId])
  switch (settingId) {
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
      break
    default:
      break
  }
  return schema
}

export const getSettingUiSchema = (settings: GetSettingsInfoApiResponse, settingId: string): any => {
  const uiSchema: any = {
    cluster: {
      k8sContext: { 'ui:widget': 'hidden' },
      defaultStorageClass: { 'ui:widget': 'hidden' },
      linode: { 'ui:widget': 'hidden' },
    },
    otomi: {
      isMultitenant: { 'ui:widget': 'hidden' },
      isPreInstalled: { 'ui:widget': 'hidden' },
      adminPassword: { 'ui:widget': 'hidden' },
      useORCS: { 'ui:widget': 'hidden' },
      aiEnabled: { 'ui:widget': 'hidden' },
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
    obj: { showWizard: { 'ui:widget': 'hidden' } },
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
  objSettings: any
}

export default function ({ settings: data, settingId, objSettings, ...other }: Props): React.ReactElement {
  const history = useHistory()
  const { appsEnabled, settings } = useSession()
  const isPreInstalled = settings.otomi.isPreInstalled || false
  const [setting, setSetting]: any = useState<GetSettingsInfoApiResponse>(data)
  const [schema, setSchema]: any = useState(getSettingSchema(appsEnabled, settingId, setting))
  const [uiSchema, setUiSchema]: any = useState(getSettingUiSchema(settings, settingId))
  const [disabledMessage, setDisabledMessage] = useState('')
  const [isObjStorageRequired, setIsObjStorageRequired] = useState(false)
  const [, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const removePreInstalledSpecificSettings = ['kms', 'dns', 'ingress']
  let isPreInstalledSetting = false

  if (removePreInstalledSpecificSettings.includes(settingId) && isPreInstalled) isPreInstalledSetting = true

  useEffect(() => {
    onChangeHandler(data)
  }, [data])

  useEffect(() => {
    if (settingId) {
      if (!appsEnabled.alertmanager && settingId === 'alerts')
        setDisabledMessage('Please enable Alertmanager to activate Alerts settings')

      if (isPreInstalledSetting)
        setDisabledMessage('These settings can not be changed when installed by Akamai Connected Cloud.')
    }
  }, [settingId])
  // END HOOKS
  const getDynamicUiSchema = (data) => {
    if (settingId !== 'alerts') return getSettingUiSchema(settings, settingId)
    const { receivers } = schema.properties
    const allReceivers = receivers?.items?.enum || []
    const uiSchema = getSettingUiSchema(settings, settingId)
    const hiddenReceivers = allReceivers.filter((receiver) => !data.receivers?.includes(receiver))
    hiddenReceivers.forEach((receiver) => {
      uiSchema[receiver] = { 'ui:widget': 'hidden' }
    })
    return uiSchema
  }
  const isLinodeConfigured = (appId: string): boolean => {
    const linode: any = objSettings?.provider?.type === 'linode' ? objSettings.provider.linode : {}
    const { accessKeyId, secretAccessKey, buckets } = linode
    return Boolean(accessKeyId && secretAccessKey && buckets?.[appId])
  }
  const getObjStorageRequired = (appId: string): boolean => {
    return Boolean(isPreInstalled && !isLinodeConfigured(appId))
  }
  const onChangeHandler = (data) => {
    const isAnyAppEnabled = Object.values(data?.database || {}).some((app: any) => app?.enabled)
    if (isAnyAppEnabled && getObjStorageRequired('cnpg')) {
      setDisabledMessage('Database backup requires object storage to be enabled.')
      setIsObjStorageRequired(true)
    } else if (data?.gitea?.enabled && getObjStorageRequired('gitea')) {
      setDisabledMessage('Gitea backup requires object storage to be enabled.')
      setIsObjStorageRequired(true)
    } else {
      setDisabledMessage('')
      setIsObjStorageRequired(false)
    }
    const schema = getSettingSchema(appsEnabled, settingId, data)
    setSetting(data)
    setSchema(schema)
    setUiSchema(getDynamicUiSchema(data))
  }

  return (
    <>
      {disabledMessage && (
        <InformationBanner message={disabledMessage}>
          {isObjStorageRequired && (
            <Button
              variant='text'
              color='primary'
              sx={{
                ml: '8px',
                px: 0,
                fontWeight: 500,
                fontSize: '16px',
                '&.MuiButton-root:hover': { bgcolor: 'transparent' },
              }}
              onClick={() => {
                setShowObjWizard(true)
                history.push('/maintenance')
              }}
            >
              Start Object Storage Wizard
            </Button>
          )}
        </InformationBanner>
      )}

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
        children={isObjStorageRequired}
      />
    </>
  )
}
