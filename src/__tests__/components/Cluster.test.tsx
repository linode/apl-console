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
  set(user.authz, 'teamA.deniedAttributes.Team', ['na'])
  expect(canDownloadKubecfg(user, 'teamA')).toBeTruthy()
})

it('team can not download kubecfg', () => {
  const user = new User()
  user.isAdmin = false
  set(user.authz, 'teamA.deniedAttributes.Team', ['downloadKubeConfig'])
  expect(canDownloadKubecfg(user, 'teamA')).toBeFalsy()
})
