import { User } from '@redkubes/otomi-api-client-axios'
import { set } from 'lodash'
import canDo from '../../utils/permission'

it('admin can download kubecfg', () => {
  const user = new User()
  user.isAdmin = true
  expect(canDo(user, 'na', 'doSomething')).toBeTruthy()
})

it('team can doSomething', () => {
  const user = new User()
  user.isAdmin = false
  set(user, 'authz.teamA.deniedAttributes.Team', ['doSomethingElse'])
  expect(canDo(user, 'teamA', 'doSomething')).toBeTruthy()
})

it('team can not doSomething', () => {
  const user = new User()
  user.isAdmin = false
  set(user, 'authz.teamA.deniedAttributes.Team', ['doSomething'])
  expect(canDo(user, 'teamA', 'doSomething')).toBeFalsy()
})

it('admin without teamId can not doSomething', () => {
  const user = new User()
  user.isAdmin = true
  expect(canDo(user, undefined, 'doSomething')).toBeFalsy()
})
