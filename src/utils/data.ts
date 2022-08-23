/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { pascalCase } from 'change-case'
import { getSpec } from 'common/api-spec'
import { getThemeMode } from 'common/theme'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, find, isArray, isEmpty, isEqual, isPlainObject, transform } from 'lodash'
import { GetSessionApiResponse } from 'redux/otomiApi'

export type CleanOptions = {
  cleanKeys?: any[]
  cleanValues?: any[]
  emptyArrays?: boolean
  emptyObjects?: boolean
  emptyStrings?: boolean
  keepValues?: any[]
  NaNValues?: boolean
  nullValues?: boolean
  undefinedValues?: boolean
  undefinedArrayValues?: boolean
}

export const cleanOptions = {
  cleanKeys: [],
  cleanValues: [],
  emptyArrays: true,
  emptyObjects: true,
  emptyStrings: true,
  keepValues: [],
  NaNValues: true,
  nullValues: true,
  undefinedValues: true,
  undefinedArrayValues: true,
}

export const cleanDeep = (object, opts: CleanOptions = {}) => {
  const o = { ...cleanOptions, ...opts }
  return transform(object, (result, value, key) => {
    // Exclude specific keys.
    if (o.cleanKeys.includes(key)) return

    // Keep specific values before recursing into objects or arrays
    // eslint-disable-next-line consistent-return
    if (o.keepValues.some((v) => isEqual(value, v))) {
      result[key] = value
      return
    }

    // Recurse into arrays and objects.
    if (Array.isArray(value) || isPlainObject(value)) value = cleanDeep(value, o)

    // Exclude specific values.
    if (o.cleanValues.includes(value)) return

    // Exclude empty objects.
    if (o.emptyObjects && isPlainObject(value) && isEmpty(value)) return

    // Exclude empty arrays.
    if (o.emptyArrays && Array.isArray(value) && !value.length) return

    // Exclude empty strings.
    if (o.emptyStrings && value === '') return

    // Exclude NaN values.
    if (o.NaNValues && Number.isNaN(value)) return

    // Exclude null values.
    if (o.nullValues && value === null) return

    // Exclude undefined values, but not in arrays if we said so
    if (o.undefinedValues && value === undefined && (!isArray(result) || (isArray(result) && o.undefinedArrayValues)))
      return

    // Append when recursing arrays.
    // eslint-disable-next-line consistent-return
    if (Array.isArray(result)) return result.push(value)

    result[key] = value
  })
}

export const cleanData = (obj: Record<string, unknown>, options?: CleanOptions): Record<string, unknown> => {
  const ret = cleanDeep(cloneDeep(obj), options) as Record<string, any> | undefined
  return ret || {}
}

export const getApps = (session, teamId) => {
  const {
    core: { adminApps, teamApps },
  }: any = session
  return (teamId === 'admin' ? adminApps : adminApps.filter((app) => app.isShared).concat(teamApps)).filter(
    (app) => !app.hide,
  )
}

const rePlace = (path, teamId) => path.replaceAll('#NS#', `team-${teamId}`).replaceAll('#TEAM#', teamId)

export const getAppData = (session: GetSessionApiResponse, teamId, appOrId, mergeShortcuts = false) => {
  const {
    core: { appsInfo },
    settings: {
      cluster,
      otomi: { isMultitenant },
    },
  }: any = session
  let appId = appOrId
  let ownShortcuts = []
  if (mergeShortcuts) {
    // we know we were given an app from values, so we pluck shortcuts from it to merge later
    ownShortcuts = appOrId.shortcuts || []
  }
  let app = {}
  if (typeof appOrId !== 'string') {
    appId = appOrId.id ?? appOrId.name
    app = appOrId
  }

  // get the core app
  const apps = getApps(session, teamId)
  const coreApp = find(apps, { name: appId })
  const { useHost, ingress, isShared, ownHost, path } = coreApp
  // bundle the shortcuts
  const coreShortcuts = coreApp.shortcuts ?? []
  const mergedShortcuts = ownShortcuts.length ? [...coreShortcuts, ...ownShortcuts] : coreShortcuts
  let substShortcuts
  if (mergedShortcuts.length) {
    substShortcuts = mergedShortcuts.map(({ path, ...other }) => ({
      path: rePlace(path, teamId),
      ...other,
    }))
  }
  // compose the derived ingress props
  const baseUrl = useHost
    ? getAppData(session, teamId, useHost).baseUrl
    : `https://${`${isShared || ownHost ? useHost || appId : 'apps'}${
        !(isShared || teamId === 'admin' || !isMultitenant) ? `.team-${teamId}` : ''
      }.${cluster.domainSuffix}${isShared || ownHost ? '' : `/${useHost || appId}`}`}`
  // also get schema info such as title, desc
  const spec = getSpec()
  const modelName = `App${pascalCase(appId as string)}`
  const schema = spec.components.schemas[modelName] ? (spec.components.schemas[modelName] as JSONSchema7) : {}
  const mode = getThemeMode()
  const logoSuffix = mode === 'light' ? '' : '-dark'
  const logoAltSuffix = mode === 'light' ? '-dark' : ''
  return {
    ...coreApp,
    ...app,
    id: appId,
    baseUrl,
    logo: `${appId}_logo${logoSuffix}.svg`,
    logoAlt: `${appId}_logo${logoAltSuffix}.svg`,
    appInfo: appsInfo[appId],
    schema,
    externalUrl: ingress || useHost ? `${baseUrl}${path ? rePlace(path, teamId) : '/'}` : undefined,
    shortcuts: substShortcuts,
    hasShortcuts: !!ingress || useHost,
  }
}

// eslint-disable-next-line no-nested-ternary
export const getRole = (teamId) => (!teamId ? 'all' : teamId === 'admin' ? 'admin' : 'team')

export const deepDiff = (base, object): Record<string, any> => {
  const changes = {}

  function walkObject(base, object, path = '') {
    for (const key of Object.keys(base)) {
      const currentPath = path === '' ? key : `${path}.${key}`

      if (object[key] === undefined) changes[currentPath] = '-'
    }

    for (const [key, value] of Object.entries(object)) {
      // eslint-disable-next-line no-nested-ternary
      const currentPath = Array.isArray(object) ? `${path}[${key}]` : path === '' ? key : `${path}.${key}`

      if (base[key] === undefined) changes[currentPath] = '+'
      else if (value !== base[key]) {
        if (typeof value === 'object' && typeof base[key] === 'object') walkObject(base[key], value, currentPath)
        else changes[currentPath] = object[key]
      }
    }
  }

  walkObject(base, object)

  return changes
}

export const cleanLink = (l: string) => l.replace('https://', '').replace(/\/$/g, '')
