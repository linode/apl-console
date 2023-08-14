import { set } from 'lodash'
import { ActivateLicenseApiResponse, GetMetricsApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import canDo, { canCreateAdditionalResource } from 'utils/permission'

const userTpl: GetSessionApiResponse['user'] = {
  name: 'ok',
  email: 'bla@bla.com',
  isAdmin: false,
  teams: [],
  roles: [],
  authz: {},
  sub: 'ok',
}

it('admin can download kubecfg', () => {
  const user: GetSessionApiResponse['user'] = { ...userTpl }
  user.isAdmin = true
  expect(canDo(user, 'na', 'doSomething')).toBeTruthy()
})

it('team can doSomething', () => {
  const user: GetSessionApiResponse['user'] = { ...userTpl }
  user.isAdmin = false
  set(user, 'authz.teamA.deniedAttributes.Team', ['doSomethingElse'])
  expect(canDo(user, 'teamA', 'doSomething')).toBeTruthy()
})

it('team can not doSomething', () => {
  const user: GetSessionApiResponse['user'] = { ...userTpl }
  user.isAdmin = false
  set(user, 'authz.teamA.deniedAttributes.Team', ['doSomething'])
  expect(canDo(user, 'teamA', 'doSomething')).toBeFalsy()
})

const metrics: GetMetricsApiResponse = {
  otomi_backups: 2,
  otomi_builds: 3,
  otomi_secrets: 6,
  otomi_services: 8,
  otomi_teams: 2,
  otomi_workloads: 9,
}

const license: ActivateLicenseApiResponse = {
  isValid: true,
  hasLicense: true,
  body: {
    version: 1,
    key: 'aa',
    type: 'community',
    capabilities: {
      teams: 2,
      services: 9,
      workloads: 9,
    },
  },
}

it('user can create additional resource service', () => {
  expect(canCreateAdditionalResource('service', metrics, license)).toBeTruthy()
})

it('user can not create additional team', () => {
  expect(canCreateAdditionalResource('team', metrics, license)).toBeFalsy()
})

it('user can not create additional resources because there is no license', () => {
  expect(canCreateAdditionalResource('team', metrics, undefined)).toBeFalsy()
})

it('user can not create additional resources because there are no metrics', () => {
  expect(canCreateAdditionalResource('team', undefined, license)).toBeFalsy()
})

it('user can not create additional resources because resource type is unknown', () => {
  expect(canCreateAdditionalResource('other', metrics, license)).toBeFalsy()
})
