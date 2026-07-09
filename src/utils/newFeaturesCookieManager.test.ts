import cookie from 'cookie'
import {
  NEW_FEATURE_COOKIE,
  NEW_FEATURE_KEYS,
  getSeenNewFeatures,
  hasSeenNewFeature,
  markNewFeatureSeen,
} from './newFeaturesCookieManager'

describe('newFeaturesCookieManager', () => {
  beforeEach(() => {
    document.cookie = cookie.serialize(NEW_FEATURE_COOKIE, '', {
      path: '/',
      expires: new Date(0),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('does not exceed the maximum number of simultaneous new features', () => {
    expect(NEW_FEATURE_KEYS.length).toBeLessThanOrEqual(6)
  })

  it('returns an empty array when the cookie does not exist', () => {
    expect(getSeenNewFeatures()).toEqual([])
  })

  it('returns the seen features from the cookie', () => {
    document.cookie = cookie.serialize(NEW_FEATURE_COOKIE, JSON.stringify(['platform-secrets', 'platform-manifests']), {
      path: '/',
    })

    expect(getSeenNewFeatures()).toEqual(['platform-secrets', 'platform-manifests'])
  })
  it('returns an empty array when the cookie contains invalid JSON', () => {
    document.cookie = cookie.serialize(NEW_FEATURE_COOKIE, 'not-json', { path: '/' })

    expect(getSeenNewFeatures()).toEqual([])
  })
  it('returns true when a feature has been seen', () => {
    document.cookie = cookie.serialize(NEW_FEATURE_COOKIE, JSON.stringify(['platform-settings']), { path: '/' })

    expect(hasSeenNewFeature('platform-settings')).toBe(true)
    expect(hasSeenNewFeature('platform-secrets')).toBe(false)
  })

  it('stores a newly seen feature in the cookie', () => {
    markNewFeatureSeen('platform-catalogs')

    expect(getSeenNewFeatures()).toContain('platform-catalogs')
  })

  it('does not store duplicate features', () => {
    markNewFeatureSeen('platform-catalogs')
    markNewFeatureSeen('platform-catalogs')

    expect(getSeenNewFeatures()).toEqual(['platform-catalogs'])
  })

  it('appends a new feature to existing ones', () => {
    document.cookie = cookie.serialize(NEW_FEATURE_COOKIE, JSON.stringify(['platform-secrets']), { path: '/' })

    markNewFeatureSeen('platform-settings')

    expect(getSeenNewFeatures()).toEqual(['platform-secrets', 'platform-settings'])
  })
})
