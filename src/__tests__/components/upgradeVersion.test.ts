import { VersionInfo, parseUpdates } from '../../utils/helpers'

it('succesfully parse the versions', () => {
  const updates: VersionInfo[] = [
    { version: 'v1.0.0', message: 'First version' },
    { version: 'v1.1.0', message: 'First minor version' },
    { version: 'v1.2.0', message: 'Second minor version' },
    { version: 'v2.0.0', message: 'Second version' },
    { version: 'v3.0.0', message: 'Third version' },
  ]

  const currentVersionUpdates = [
    { version: 'v1.1.0', message: 'First minor version' },
    { version: 'v1.2.0', message: 'Second minor version' },
  ]
  const d = parseUpdates(updates, 'v1.0.0')
  expect(d).toEqual({
    currentVersionUpdates,
  })
})
