import { isEmpty, takeRight } from 'lodash'

export interface VersionUpdates {
  currentVersionUpdates?: VersionInfo[]
}

export interface VersionInfo {
  version: string
  message: string
}

export function parseUpdates(updates: VersionInfo[], currentVersion: string): VersionUpdates {
  const parseVersion = (version: string) => version.replace('v', '').split('.').map(Number)

  const compareVersions = (v1: string, v2: string) => {
    const [major1, minor1, patch1] = parseVersion(v1)
    const [major2, minor2, patch2] = parseVersion(v2)
    if (major1 !== major2) return major1 - major2
    if (minor1 !== minor2) return minor1 - minor2
    return patch1 - patch2
  }

  const [currentMajor] = parseVersion(currentVersion)

  const currentVersionUpdates = updates
    .filter(({ version }) => {
      const [major] = parseVersion(version)
      return major === currentMajor && compareVersions(version, currentVersion) > 0
    })
    .sort((a, b) => compareVersions(a.version, b.version))

  return {
    currentVersionUpdates: takeRight(currentVersionUpdates, 5),
  }
}

export function valueArrayToObject(
  array?:
    | {
        key: string
        value: string
      }[]
    | undefined,
): Record<string, string> | undefined {
  if (!array || isEmpty(array)) return undefined

  const obj = {}
  array.forEach((item) => {
    obj[item.key] = item.value
  })
  return obj
}

export function mapObjectToKeyValueArray(obj?: Record<string, string>): { key: string; value: string }[] | undefined {
  if (!obj || isEmpty(obj)) return undefined

  return Object.entries(obj).map(([key, value]) => ({ key, value }))
}
