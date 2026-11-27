export const SAFE_REPO_URL =
  /^(?:https:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/|git@[A-Za-z0-9.-]+\.[A-Za-z]{2,}:|[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/)[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)+(?:\.git)?$/

export const DEFAULT_GIT_SERVER_URL = 'git-server.git-server.svc.cluster.local'

export const GLOBAL_PULL_SECRET = {
  namespace: 'apl-secrets',
  name: 'otomi-secrets',
  passwordKey: 'globalPullSecret_password',
  setupPath: '/secrets/global-pull-secret',
  secretPath: '/secrets/apl-secrets/otomi-secrets',
}
