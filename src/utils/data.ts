/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { Session } from '@redkubes/otomi-api-client-axios'
import camelcase from 'camelcase'
import { JSONSchema7 } from 'json-schema'
import { find, isEmpty, isPlainObject, transform } from 'lodash'
import { getSpec } from '../api-spec'

export const cleanOptions = {
  cleanKeys: [],
  cleanValues: [],
  cleanArrays: true,
  emptyArrays: true,
  emptyObjects: true,
  emptyStrings: true,
  NaNValues: false,
  nullValues: true,
  undefinedValues: true,
}

const cleanDeep = (
  object: any,
  {
    cleanKeys = [],
    cleanValues = [],
    cleanArrays = true,
    emptyArrays = true,
    emptyObjects = true,
    emptyStrings = true,
    NaNValues = false,
    nullValues = true,
    undefinedValues = true,
  } = {},
) => {
  return transform(object, (result, value, key) => {
    // Exclude specific keys.
    if (cleanKeys.includes(key)) {
      return
    }

    // Recurse into arrays and objects.
    if ((Array.isArray(value) && cleanArrays) || isPlainObject(value)) {
      value = cleanDeep(value, {
        NaNValues,
        cleanKeys,
        cleanValues,
        cleanArrays,
        emptyArrays,
        emptyObjects,
        emptyStrings,
        nullValues,
        undefinedValues,
      })
    }

    // Exclude specific values.
    if (cleanValues.includes(value)) {
      return
    }

    // Exclude empty objects.
    if (emptyObjects && isPlainObject(value) && isEmpty(value)) {
      return
    }

    // Exclude empty arrays.
    if (emptyArrays && Array.isArray(value) && !value.length) {
      return
    }

    // Exclude empty strings.
    if (emptyStrings && value === '') {
      return
    }

    // Exclude NaN values.
    if (NaNValues && Number.isNaN(value)) {
      return
    }

    // Exclude null values.
    if (nullValues && value === null) {
      return
    }

    // Exclude undefined values.
    if (undefinedValues && value === undefined) {
      return
    }

    // Append when recursing arrays.
    if (Array.isArray(result)) {
      // eslint-disable-next-line consistent-return
      return result.push(value)
    }

    result[key] = value
  })
}

export const cleanData = (obj: Record<string, unknown>, inOptions = {}): Record<string, unknown> => {
  const options = {
    ...cleanOptions,
    cleanArrays: false,
    emptyArrays: false,
    emptyObjects: true,
    emptyStrings: true,
    nullValues: true,
    undefinedValues: true,
    ...inOptions,
  }
  return cleanDeep(obj, options) as Record<string, unknown>
}

// TODO: https://github.com/redkubes/otomi-api/issues/183
export const renameKeys = (data) => {
  if (data === undefined) return data
  const keyValues = Object.keys(data).map((key) => {
    const newKey = key.replaceAll('-', '_')
    return { [newKey]: data[key] }
  })
  return Object.assign({}, ...keyValues)
}

export const getApps = (adminApps, teamApps, teamId) =>
  (teamId === 'admin' ? adminApps : adminApps.filter((app) => app.isShared).concat(teamApps)).filter((app) => !app.hide)

export const getAppData = (session: Session, teamId, appOrId, mergeShortcuts = false) => {
  const {
    core: {
      apps: adminApps,
      teamConfig: { apps: teamApps },
    },
    cluster,
    isMultitenant,
  }: any = session
  let appId = appOrId
  let ownShortcuts = []
  if (mergeShortcuts) {
    // we know we were given an app from values, so we pluck shortcuts from it to merge later
    ownShortcuts = appOrId.shortcuts || []
  }
  if (typeof appOrId !== 'string') {
    appId = appOrId.id ?? appOrId.name
  }
  // get the core app
  const apps = getApps(adminApps, teamApps, teamId)
  const coreApp = find(apps, { name: appId })
  const { logo, ingress, isShared } = coreApp
  // bundle the shortcuts
  const coreShortcuts = coreApp.shortcuts ?? []
  const mergedShortcuts = ownShortcuts.length ? [...coreShortcuts, ...ownShortcuts] : coreShortcuts
  let substShortcuts
  if (mergedShortcuts.length)
    substShortcuts = mergedShortcuts.map(({ path, ...rest }) => ({
      path: path.replace('#NS#', `team-${teamId}`),
      ...rest,
    }))
  // compose the derived ingress props
  const { domain, host, ownHost, path } = (ingress && ingress[0]) || {}
  const baseUrl = `https://${
    domain ||
    `${isShared || ownHost ? host || appId : 'apps'}${
      !(isShared || teamId === 'admin' || !isMultitenant) ? `.team-${teamId}` : ''
    }.${cluster.domainSuffix}${isShared || ownHost ? '' : `/${host || appId}`}`
  }`
  const substPath = `${(path || '').replace('#NS#', `team-${teamId}`)}`
  // create a default link if we have ingress or shortcuts
  let link
  if (substShortcuts?.length) link = `${baseUrl}/${substShortcuts[0].path}`
  else if (ingress) link = `${baseUrl}/${substPath}`
  // also get schema info such as title, desc
  const spec = getSpec()
  const modelName = `App${camelcase(appId, { pascalCase: true })}`
  const schema = spec.components.schemas[modelName]
    ? (spec.components.schemas[modelName] as JSONSchema7)
    : { title: appId, description: '' }
  return {
    ...coreApp,
    id: appId,
    baseUrl,
    docUrl: schema['x-externalDocsPath'],
    logo: logo ?? `${appId}_logo.svg`,
    schema,
    link,
    path: substPath,
    shortcuts: substShortcuts,
  }
}
