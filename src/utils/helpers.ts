import { isEmpty } from 'lodash'

export interface VersionUpdates {
  currentVersionUpdates?: VersionInfo[]
}

export interface VersionInfo {
  version: string
  message: string
  supported_k8s_versions: string[]
}

export function parseUpdates(
  updates: VersionInfo[],
  currentVersion: string,
  clusterK8sVersion: string,
): VersionUpdates {
  const parseVersion = (version: string) => version.replace('v', '').split('.').map(Number)

  const compareVersions = (v1: string, v2: string) => {
    const [major1, minor1, patch1] = parseVersion(v1)
    const [major2, minor2, patch2] = parseVersion(v2)
    if (major1 !== major2) return major1 - major2
    if (minor1 !== minor2) return minor1 - minor2
    return patch1 - patch2
  }

  // Get all updates higher than currentVersion, sorted
  const higherUpdates = updates
    .filter(({ version }) => compareVersions(version, currentVersion) > 0)
    .sort((a, b) => compareVersions(a.version, b.version))

  // Get all updates compatible with the clusterK8sVersion
  const compatible = higherUpdates.filter((u) => u.supported_k8s_versions.includes(clusterK8sVersion))

  // Take the latest 4 compatible updates
  let filteredUpdates = compatible.slice(0, 4)

  // If fewer than 4, fill with more higher updates (not already included)
  if (filteredUpdates.length < 4) {
    const extra = higherUpdates
      .filter((u) => !filteredUpdates.some((fu) => fu.version === u.version))
      .slice(0, 4 - filteredUpdates.length)
    filteredUpdates = [...filteredUpdates, ...extra]
  }

  // Add the next update after those 4 (if any)
  let nextUpdate: VersionInfo | undefined
  if (higherUpdates.length > filteredUpdates.length) {
    nextUpdate = higherUpdates[filteredUpdates.length]
    if (nextUpdate && !filteredUpdates.some((u) => u.version === nextUpdate.version))
      filteredUpdates = [...filteredUpdates, { ...nextUpdate }]
  } else if (filteredUpdates.length > 0) {
    // If there are no more, mark the last as isLatest
    filteredUpdates = filteredUpdates.map((u, i) => (i === filteredUpdates.length - 1 ? { ...u, isLatest: true } : u))
  }

  return {
    currentVersionUpdates: filteredUpdates,
  }
}

export function latestApplicableUpdateVersion(versions: VersionInfo[], clusterK8sVersion: string) {
  const applicableUpdates = versions.filter((update) => update.supported_k8s_versions.includes(clusterK8sVersion))
  return applicableUpdates.length > 0 ? applicableUpdates[applicableUpdates.length - 1] : undefined
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
    if (!item || !item.key) return
    obj[item.key] = item.value
  })
  return isEmpty(obj) ? undefined : obj
}

export function mapObjectToKeyValueArray(obj?: Record<string, string>): { key: string; value: string }[] | undefined {
  if (!obj || isEmpty(obj)) return undefined

  return Object.entries(obj).map(([key, value]) => ({ key, value }))
}

export function checkAgainstK8sVersion(update: VersionInfo, currentVersion: string) {
  const supportedVersions = update.supported_k8s_versions

  if (!supportedVersions || supportedVersions.length === 0) return false

  return supportedVersions.includes(currentVersion)
}
