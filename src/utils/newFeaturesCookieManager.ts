import cookie from 'cookie'

export const NEW_FEATURE_COOKIE = 'apl-seen-new-features'

export type NewFeatureKey =
  | 'platform-secrets'
  | 'platform-catalogs'
  | 'platform-settings'
  | 'settings-gitops'
  | 'platform-manifests'

export const getSeenNewFeatures = (): NewFeatureKey[] => {
  const cookies = cookie.parse(document.cookie)
  return cookies[NEW_FEATURE_COOKIE] ? JSON.parse(cookies[NEW_FEATURE_COOKIE]) : []
}

export const hasSeenNewFeature = (key: NewFeatureKey) => getSeenNewFeatures().includes(key)

export const markNewFeatureSeen = (key: NewFeatureKey) => {
  const seen = new Set(getSeenNewFeatures())
  seen.add(key)

  document.cookie = cookie.serialize(NEW_FEATURE_COOKIE, JSON.stringify([...seen]), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
}
