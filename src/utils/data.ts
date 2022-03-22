/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { Session } from '@redkubes/otomi-api-client-axios'
import { pascalCase } from 'change-case'
import { getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { find, isEmpty, isPlainObject, transform } from 'lodash'

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
) =>
  transform(object, (result, value, key) => {
    // Exclude specific keys.
    if (cleanKeys.includes(key)) return

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
    if (cleanValues.includes(value)) return

    // Exclude empty objects.
    if (emptyObjects && isPlainObject(value) && isEmpty(value)) return

    // Exclude empty arrays.
    if (emptyArrays && Array.isArray(value) && !value.length) return

    // Exclude empty strings.
    if (emptyStrings && value === '') return

    // Exclude NaN values.
    if (NaNValues && Number.isNaN(value)) return

    // Exclude null values.
    if (nullValues && value === null) return

    // Exclude undefined values.
    if (undefinedValues && value === undefined) return

    // Append when recursing arrays.
    if (Array.isArray(result)) {
      // eslint-disable-next-line consistent-return
      return result.push(value)
    }

    result[key] = value
  })

export const cleanData = (
  obj: Record<string, unknown>,
  inOptions = {},
  schema = undefined,
): Record<string, unknown> => {
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
  // if (schema) {
  //   // schema given, filter out defaults
  //   const defPaths = extract(schema, (p: JSONSchema7) => p.default ?? p['x-default'])
  //   each(defPaths, function (def, p) {
  //     if (def === undefined) return
  //     const data = get(obj, p)
  //     // if same as before set it to undefined to filter with cleanDeep
  //     if (isEqual(data, def)) set(obj, p, undefined)
  //   })
  // }
  return cleanDeep(obj, options) as Record<string, unknown>
}

// TODO: https://github.com/redkubes/otomi-api/issues/183
export const renameKeys = (data) => {
  return data
  // if (data === undefined) return data
  // const keyValues = Object.keys(data).map((key) => {
  //   const newKey = key.replaceAll('-', '_')
  //   return { [newKey]: data[key] }
  // })
  // return Object.assign({}, ...keyValues)
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

export const getAppData = (session: Session, teamId, appOrId, mergeShortcuts = false) => {
  const {
    core: { adminApps, teamApps },
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
  const { useHost, logo, ingress, isShared, ownHost, path } = coreApp
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
  const modelName = `App${pascalCase(appId)}`
  const schema = spec.components.schemas[modelName]
    ? (spec.components.schemas[modelName] as JSONSchema7)
    : { title: appId, description: '' }
  return {
    ...coreApp,
    ...app,
    id: appId,
    baseUrl,
    docUrl: schema['x-externalDocsPath'],
    logo: logo ?? `${appId}_logo.svg`,
    schema,
    externalUrl: ingress || useHost ? `${baseUrl}${path ? rePlace(path, teamId) : '/'}` : undefined,
    shortcuts: substShortcuts,
    hasShortcuts: !!ingress || useHost,
  }
}
