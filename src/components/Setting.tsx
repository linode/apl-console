import { Box, Button, Typography } from '@mui/material'
import Ajv, { ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import { getSpec } from 'common/api-spec'
import { cloneDeep, get, isEqual, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import { cleanData } from 'utils/data'
import { nullify } from 'utils/schema'
import HeaderTitle from './HeaderTitle'
import InformationBanner from './InformationBanner'
import SettingField, { updateSettingValue } from './settings/SettingField'
import { SettingsSchema, activeSchema, asSchema, defaultsForSchema } from './settings/schema'

export const getSettingSchema = (appsEnabled: Record<string, boolean>, settingId: string): SettingsSchema => {
  const definition = getSpec().components.schemas.Settings.properties[settingId]
  if (!definition || typeof definition !== 'object') throw new Error(`Unknown setting schema: ${settingId}`)
  const schema = cloneDeep(definition)
  if (settingId === 'cluster') {
    unset(schema, 'properties.provider.description')
    set(schema, 'properties.provider.readOnly', true)
  }
  if (settingId === 'platformBackups') {
    if (!appsEnabled.harbor) set(schema, 'properties.database.properties.harbor.readOnly', true)
    if (!appsEnabled.gitea) {
      set(schema, 'properties.database.properties.gitea.readOnly', true)
      set(schema, 'properties.gitea.readOnly', true)
    }
  }
  return schema
}

const hiddenBySetting: Record<string, string[]> = {
  cluster: ['k8sContext', 'defaultStorageClass', 'linode'],
  otomi: ['isMultitenant', 'isPreInstalled', 'adminPassword', 'useORCS', 'aiEnabled', 'git'],
  kms: ['sops.provider'],
  ingress: ['platformClass.className'],
  obj: ['showWizard'],
}

const errorsByPath = (errors: ErrorObject[]): Record<string, string[]> => {
  const result: Record<string, string[]> = {}
  errors.forEach((error) => {
    const path = error.instancePath
      .split('/')
      .slice(1)
      .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'))
    if (error.keyword === 'required' && typeof error.params.missingProperty === 'string')
      path.push(error.params.missingProperty)
    const key = path.join('.')
    result[key] = [...(result[key] ?? []), error.message ?? 'Invalid value']
  })
  return result
}

interface Props extends Omit<CrudProps, 'onSubmit'> {
  settings: Record<string, unknown>
  settingId: string
  objSettings: any
  onSubmit: (data: Record<string, unknown>) => boolean | void | Promise<boolean | void>
}

export default function Setting({
  settings: data,
  settingId,
  objSettings,
  onSubmit,
  mutating,
}: Props): React.ReactElement {
  const history = useHistory()
  const { appsEnabled, settings } = useSession()
  const schema = useMemo(
    () => getSettingSchema(appsEnabled, settingId),
    [appsEnabled.harbor, appsEnabled.gitea, settingId],
  )
  const initialData = useMemo(() => defaultsForSchema(schema, data) as Record<string, unknown>, [schema, data])
  const [setting, setSetting] = useState(initialData)
  const [original, setOriginal] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [editorErrors, setEditorErrors] = useState<Record<string, string>>({})
  const [, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const previousData = useRef({ settingId, data })

  useEffect(() => {
    if (previousData.current.settingId === settingId && isEqual(previousData.current.data, data)) return
    previousData.current = { settingId, data }
    setSetting(initialData)
    setOriginal(initialData)
    setErrors({})
    setEditorErrors({})
  }, [data, initialData, settingId])

  const isPreInstalled = Boolean(settings.otomi.isPreInstalled)
  const isPreInstalledSetting = isPreInstalled && ['kms', 'dns', 'ingress'].includes(settingId)
  const linode = objSettings?.provider?.type === 'linode' ? objSettings.provider.linode : undefined
  const isConfigured = (app: string) =>
    Boolean(linode?.accessKeyId && linode?.secretAccessKey && linode?.buckets?.[app])
  const backup = settingId === 'platformBackups' ? setting : {}
  const database = backup.database && typeof backup.database === 'object' ? backup.database : {}
  const databaseEnabled = Object.values(database).some((app) => app && typeof app === 'object' && app.enabled)
  const gitea = backup.gitea && typeof backup.gitea === 'object' ? backup.gitea : undefined
  const missingDatabaseStorage = isPreInstalled && databaseEnabled && !isConfigured('cnpg')
  const missingGiteaStorage = isPreInstalled && get(gitea, 'enabled') && !isConfigured('gitea')
  const isObjStorageRequired = Boolean(missingDatabaseStorage || missingGiteaStorage)
  let disabledMessage = ''
  if (missingDatabaseStorage) disabledMessage = 'Database backup requires object storage to be enabled.'
  else if (missingGiteaStorage) disabledMessage = 'Gitea backup requires object storage to be enabled.'
  else if (isPreInstalledSetting)
    disabledMessage = 'These settings can not be changed when installed by Akamai Connected Cloud.'
  else if (settingId === 'alerts' && !appsEnabled.alertmanager)
    disabledMessage = 'Please enable Alertmanager to activate Alerts settings'
  const hiddenPaths = [...(hiddenBySetting[settingId] ?? [])]
  if (settingId === 'alerts') {
    const receivers = Array.isArray(setting.receivers) ? setting.receivers : []
    ;['slack', 'msteams'].forEach((receiver) => {
      if (!receivers.includes(receiver)) hiddenPaths.push(receiver)
    })
  }
  const disabledPaths = settingId === 'kms' ? ['sops.age.publicKey', 'sops.age.privateKey'] : []
  if (settingId === 'ingress' && !settings.otomi.hasExternalDNS) disabledPaths.push('classes')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isObjStorageRequired || isPreInstalledSetting || mutating || Object.keys(editorErrors).length) return
    const validationData = cleanData(setting, {
      emptyArrays: false,
      emptyObjects: false,
      nullValues: false,
      undefinedValues: false,
    })
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)
    const validate = ajv.compile(activeSchema(schema, setting))
    if (!validate(validationData)) {
      setErrors(errorsByPath(validate.errors ?? []))
      return
    }
    setErrors({})
    const cleaned = cleanData(setting, { emptyArrays: false, nullValues: false, undefinedValues: false })
    const saved = await onSubmit(nullify(cleaned, schema))
    if (saved !== false) setOriginal(cloneDeep(setting))
  }

  return (
    <>
      {disabledMessage && (
        <InformationBanner message={disabledMessage}>
          {isObjStorageRequired && (
            <Button
              variant='text'
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
      <HeaderTitle
        title='Settings'
        resourceType='Settings'
        docUrl={
          schema['x-externalDocsPath']
            ? `https://techdocs.akamai.com/app-platform/docs/${schema['x-externalDocsPath']}`
            : undefined
        }
      />
      {schema.title && (
        <Typography variant='h5' sx={{ mb: 1 }}>
          {schema.title}
        </Typography>
      )}
      {schema.description && <Typography sx={{ mb: 2 }}>{schema.description}</Typography>}
      <form onSubmit={handleSubmit} noValidate>
        <SettingField
          schema={asSchema(schema)}
          value={setting}
          path={[]}
          disabled={isPreInstalledSetting || mutating}
          hiddenPaths={hiddenPaths}
          disabledPaths={disabledPaths}
          errors={errors}
          onChange={(path, value) => {
            setSetting((current) => updateSettingValue(current, path, value))
            setErrors({})
          }}
          onEditorError={(path, error) =>
            setEditorErrors((current) => {
              const next = { ...current }
              if (error) next[path] = error
              else delete next[path]
              return next
            })
          }
        />
        {settingId === 'ingress' && !settings.otomi.hasExternalDNS && (
          <Typography variant='body2'>Hint: Deploy Otomi with your DNS settings to enable this feature.</Typography>
        )}
        {errors['']?.map((error) => (
          <Typography color='error' key={error}>
            {error}
          </Typography>
        ))}
        <Box display='flex' justifyContent='flex-end' sx={{ mt: 2 }}>
          <Button
            type='submit'
            variant='contained'
            disabled={
              isPreInstalledSetting ||
              isObjStorageRequired ||
              mutating ||
              Object.keys(editorErrors).length > 0 ||
              isEqual(
                cleanData(setting, { nullValues: false, emptyArrays: false, emptyObjects: false }),
                cleanData(original, { nullValues: false, emptyArrays: false, emptyObjects: false }),
              )
            }
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  )
}
