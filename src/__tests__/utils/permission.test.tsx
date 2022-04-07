import { set } from 'lodash'
import { GetSessionApiResponse } from 'redux/otomiApi'
import canDo from 'utils/permission'

const userTpl: GetSessionApiResponse['user'] = {
  name: 'ok',
  email: 'bla@bla.com',
  isAdmin: false,
  teams: [],
  roles: [],
  authz: {},
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

it('admin without teamId can not doSomething', () => {
  const user: GetSessionApiResponse['user'] = { ...userTpl }
  user.isAdmin = true
  expect(canDo(user, undefined, 'doSomething')).toBeFalsy()
})
