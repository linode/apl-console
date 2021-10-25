import { User } from '@redkubes/otomi-api-client-axios'
import get from 'lodash/get'

export default function canDo(user: User, teamId: string | undefined, action): boolean {
  if (!teamId) return false
  if (user.isAdmin) return true
  const deniedActions = get(user, `authz.${teamId}.deniedAttributes.Team`, [])
  return !deniedActions.includes(action)
}
