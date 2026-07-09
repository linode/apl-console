import cookie from 'cookie'

export const NEW_FEATURE_COOKIE = 'apl-seen-new-features'

export type NewFeatureKey =
  | 'platform-secrets'
  | 'platform-catalogs'
  | 'platform-settings'
  | 'settings-gitops'
  | 'platform-manifests'

export const getSeenNewFeatures = (): NewFeatureKey[] => {
  if (typeof document === 'undefined') return []

  const cookies = cookie.parse(document.cookie ?? '')
  const raw = cookies[NEW_FEATURE_COOKIE]

  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    const validKeys: NewFeatureKey[] = [
      'platform-secrets',
      'platform-catalogs',
      'platform-settings',
      'settings-gitops',
      'platform-manifests',
    ]

    return parsed.filter((v): v is NewFeatureKey => typeof v === 'string' && validKeys.includes(v as NewFeatureKey))
  } catch {
    return []
  }
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
