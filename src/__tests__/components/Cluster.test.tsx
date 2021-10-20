import { User } from '@redkubes/otomi-api-client-axios'
import { set } from 'lodash'
import { canDownloadKubecfg } from '../../components/Cluster'

it('admin can download kubecfg', () => {
  const user = new User()
  user.isAdmin = true
  expect(canDownloadKubecfg(user, 'na')).toBeTruthy()
})

it('team can download kubecfg', () => {
  const user = new User()
  user.isAdmin = false
  set(user, 'authz.teamA.deniedAttributes.Team', ['other'])
  expect(canDownloadKubecfg(user, 'teamA')).toBeTruthy()
})

it('team can not download kubecfg as downloadKubeConfig is not allowed', () => {
  const user = new User()
  user.isAdmin = false
  set(user, 'authz.teamA.deniedAttributes.Team', ['downloadKubeConfig'])
  expect(canDownloadKubecfg(user, 'teamA')).toBeFalsy()
})

it('any user can not download kubecfg if no team id', () => {
  const user = new User()
  expect(canDownloadKubecfg(user, undefined)).toBeFalsy()
})
