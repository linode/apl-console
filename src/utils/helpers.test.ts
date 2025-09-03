import {
  VersionInfo,
  checkAgainstK8sVersion,
  latestApplicableUpdateVersion,
  mapObjectToKeyValueArray,
  parseUpdates,
  valueArrayToObject,
} from './helpers'

describe('parseUpdates', () => {
  const updates: VersionInfo[] = [
    {
      version: 'v1.20.0',
      message: 'Update 1',
      supported_k8s_versions: ['1.18', '1.19'],
    },
    {
      version: 'v1.21.0',
      message: 'Update 2',
      supported_k8s_versions: ['1.19', '1.20'],
    },
    {
      version: 'v1.22.0',
      message: 'Update 3',
      supported_k8s_versions: ['1.20', '1.21'],
    },
    {
      version: 'v1.23.0',
      message: 'Update 4',
      supported_k8s_versions: ['1.21', '1.22'],
    },
    {
      version: 'v1.24.0',
      message: 'Update 5',
      supported_k8s_versions: ['1.22', '1.23'],
    },
    {
      version: 'v1.25.0',
      message: 'Update 6',
      supported_k8s_versions: ['1.23', '1.24'],
    },
  ]

  it('returns updates matching supported_k8s_versions', () => {
    const result = parseUpdates(updates, 'v1.20.0', '1.21')
    expect(result.currentVersionUpdates?.[0].version).toBe('v1.22.0')
  })

  it('returns sorted updates for current major version', () => {
    const result = parseUpdates(updates, 'v1.21.0', '1.18')
    expect(result.currentVersionUpdates?.map((u) => u.version)).toEqual(['v1.22.0', 'v1.23.0', 'v1.24.0', 'v1.25.0'])
  })

  it('returns at most 5 updates', () => {
    const result = parseUpdates(updates, 'v1.19.0', '1.18')
    expect(result.currentVersionUpdates?.length).toBeLessThanOrEqual(5)
  })

  it('returns empty if no updates available', () => {
    const result = parseUpdates([], 'v1.20.0', '1.18')
    expect(result.currentVersionUpdates).toEqual([])
  })
})

describe('latestApplicableUpdateVersion', () => {
  const versions: VersionInfo[] = [
    { version: 'v1.20.0', message: '', supported_k8s_versions: ['1.18'] },
    { version: 'v1.21.0', message: '', supported_k8s_versions: ['1.19'] },
    { version: 'v1.22.0', message: '', supported_k8s_versions: ['1.20'] },
  ]

  it('returns the latest applicable update', () => {
    const result = latestApplicableUpdateVersion(versions, '1.19')
    expect(result?.version).toBe('v1.21.0')
  })

  it('returns undefined if no applicable update', () => {
    const result = latestApplicableUpdateVersion(versions, '1.25')
    expect(result).toBeUndefined()
  })
})

describe('valueArrayToObject', () => {
  it('converts array to object', () => {
    const arr = [
      { key: 'foo', value: 'bar' },
      { key: 'baz', value: 'qux' },
    ]
    expect(valueArrayToObject(arr)).toEqual({ foo: 'bar', baz: 'qux' })
  })

  it('returns undefined for empty array', () => {
    expect(valueArrayToObject([])).toBeUndefined()
  })

  it('skips items without key', () => {
    const arr = [
      { key: '', value: 'bar' },
      { key: 'baz', value: 'qux' },
    ]
    expect(valueArrayToObject(arr)).toEqual({ baz: 'qux' })
  })

  it('returns undefined for undefined input', () => {
    expect(valueArrayToObject(undefined)).toBeUndefined()
  })
})

describe('mapObjectToKeyValueArray', () => {
  it('converts object to array', () => {
    const obj = { foo: 'bar', baz: 'qux' }
    expect(mapObjectToKeyValueArray(obj)).toEqual([
      { key: 'foo', value: 'bar' },
      { key: 'baz', value: 'qux' },
    ])
  })

  it('returns undefined for empty object', () => {
    expect(mapObjectToKeyValueArray({})).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    expect(mapObjectToKeyValueArray(undefined)).toBeUndefined()
  })
})

describe('checkAgainstK8sVersion', () => {
  const update: VersionInfo = {
    version: '1.2.3',
    message: 'Test update',
    supported_k8s_versions: ['1.25', '1.26', '1.27'],
  }

  it('returns true if currentVersion is in supported_k8s_versions', () => {
    expect(checkAgainstK8sVersion(update, '1.26')).toBe(true)
  })

  it('returns false if currentVersion is not in supported_k8s_versions', () => {
    expect(checkAgainstK8sVersion(update, '1.28')).toBe(false)
  })

  it('returns false if supported_k8s_versions is empty', () => {
    const updateEmpty: VersionInfo = { ...update, supported_k8s_versions: [] }
    expect(checkAgainstK8sVersion(updateEmpty, '1.25')).toBe(false)
  })

  it('returns false if supported_k8s_versions is undefined', () => {
    const updateUndefined: VersionInfo = { ...update, supported_k8s_versions: undefined as any }
    expect(checkAgainstK8sVersion(updateUndefined, '1.25')).toBe(false)
  })
})
