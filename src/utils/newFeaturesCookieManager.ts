import Cookies from 'js-cookie'

export const NEW_FEATURE_COOKIE = 'apl-seen-new-features'

export const NEW_FEATURE_KEYS = [
  'platform-secrets',
  'platform-catalogs',
  'platform-settings',
  'settings-gitops',
  'platform-manifests',
] as const

export type NewFeatureKey = typeof NEW_FEATURE_KEYS[number]

export const getSeenNewFeatures = (): NewFeatureKey[] => {
  const raw = Cookies.get(NEW_FEATURE_COOKIE)

  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (v): v is NewFeatureKey => typeof v === 'string' && NEW_FEATURE_KEYS.includes(v as NewFeatureKey),
    )
  } catch {
    return []
  }
}

export const hasSeenNewFeature = (key: NewFeatureKey) => getSeenNewFeatures().includes(key)

export const markNewFeatureSeen = (key: NewFeatureKey) => {
  const seen = new Set(getSeenNewFeatures())
  seen.add(key)

  Cookies.set(NEW_FEATURE_COOKIE, JSON.stringify([...seen]), {
    path: '/',
    expires: 365,
  })
}
