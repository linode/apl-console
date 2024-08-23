import { getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, find, isArray, isEmpty, isEqual, isPlainObject, transform } from 'lodash'
import { GetSessionApiResponse } from 'redux/otomiApi'
import { sentenceCase as sentenceCaseOrig } from 'change-case'
import { getAppSchemaName, getCoreAppId } from './schema'

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

const getDeprecatedApp = (session, appId) => {
  const {
    core: { appsInfo },
  }: any = session
  const app = appsInfo[appId]
  return app?.isDeprecated
}

const getBetaApp = (session, appId) => {
  const {
    core: { appsInfo },
  }: any = session
  const app = appsInfo[appId]
  return app?.isBeta
}

const getDeprecationInfo = (session, appId) => {
  const {
    core: { appsInfo },
  }: any = session
  const app = appsInfo[appId]
  return app?.deprecationInfo
}

export const getAppData = (
  session: GetSessionApiResponse,
  teamId,
  appOrId,
  mergeShortcuts = false,
): Record<string, any> => {
  const {
    core: { appsInfo },
    settings: { cluster },
  }: any = session
  let appId = appOrId
  let ownShortcuts = []
  if (mergeShortcuts) {
    // we know we were given an app from values, so we pluck shortcuts from it to merge later
    ownShortcuts = appOrId.shortcuts || []
  }
  let app = {}
  if (typeof appOrId !== 'string') {
    appId = appOrId?.id ?? appOrId?.name
    app = appOrId
  }

  // get the core app
  const apps = getApps(session, teamId)
  const coreAppId = getCoreAppId(appId)
  const coreApp = find(apps, { name: coreAppId })
  if (coreApp === undefined) return
  const { useHost, ingress, isShared, path } = coreApp
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
  const hostSuffix = `${!(isShared || teamId === 'admin') ? `-${teamId}` : ''}`
  const host = `${useHost || appId}${hostSuffix}`
  const baseUrl = `https://${host}.${cluster.domainSuffix}`

  // also get schema info such as title, desc
  const spec = getSpec()
  const modelName = getAppSchemaName(appId)
  const schema = spec.components.schemas[modelName] ? (spec.components.schemas[modelName] as JSONSchema7) : {}
  // const mode = getThemeMode()
  const logoSuffix = ''
  const logoAltSuffix = ''
  const deps = coreApp.deps
  const isDeprecated = getDeprecatedApp(session, appId)
  const isBeta = getBetaApp(session, appId)
  const deprecationInfo = getDeprecationInfo(session, appId)
  const replacementUrl = `https://${deprecationInfo?.replacement}.${cluster.domainSuffix}${deprecationInfo?.path ?? ''}`
  return {
    ...coreApp,
    ...app,
    id: appId,
    baseUrl,
    deps,
    logo: `${coreAppId}_logo${logoSuffix}.svg`,
    logoAlt: `${coreAppId}_logo${logoAltSuffix}.svg`,
    appInfo: appsInfo[coreAppId],
    schema,
    externalUrl: ingress || useHost ? `${baseUrl}${path ? rePlace(path, teamId) : '/'}` : undefined,
    shortcuts: substShortcuts,
    hasShortcuts: !!ingress || useHost,
    isDeprecated,
    isBeta,
    deprecationInfo,
    replacementUrl,
  }
}

// eslint-disable-next-line no-nested-ternary
export const getRole = (teamId) => (!teamId ? 'all' : teamId === 'admin' ? 'admin' : 'team')

export const cleanLink = (l: string): string => l.replace('https://', '').replace(/\/$/g, '')

export const sentenceCase = (str: string) => sentenceCaseOrig(str, { stripRegexp: /[-_]+/gi })
