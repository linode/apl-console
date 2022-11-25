import { emptySplitApi as api } from './emptyApi'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllSecrets: build.query<GetAllSecretsApiResponse, GetAllSecretsApiArg>({
      query: () => ({ url: `/secrets` }),
    }),
    getAllJobs: build.query<GetAllJobsApiResponse, GetAllJobsApiArg>({
      query: () => ({ url: `/jobs` }),
    }),
    getAllServices: build.query<GetAllServicesApiResponse, GetAllServicesApiArg>({
      query: () => ({ url: `/services` }),
    }),
    getTeams: build.query<GetTeamsApiResponse, GetTeamsApiArg>({
      query: () => ({ url: `/teams` }),
    }),
    createTeam: build.mutation<CreateTeamApiResponse, CreateTeamApiArg>({
      query: (queryArg) => ({ url: `/teams`, method: 'POST', body: queryArg.body }),
    }),
    getTeam: build.query<GetTeamApiResponse, GetTeamApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}` }),
    }),
    editTeam: build.mutation<EditTeamApiResponse, EditTeamApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}`, method: 'PUT', body: queryArg.body }),
    }),
    deleteTeam: build.mutation<DeleteTeamApiResponse, DeleteTeamApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}`, method: 'DELETE' }),
    }),
    getTeamJobs: build.query<GetTeamJobsApiResponse, GetTeamJobsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/jobs` }),
    }),
    createJob: build.mutation<CreateJobApiResponse, CreateJobApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/jobs`, method: 'POST', body: queryArg.body }),
    }),
    getTeamServices: build.query<GetTeamServicesApiResponse, GetTeamServicesApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services` }),
    }),
    createService: build.mutation<CreateServiceApiResponse, CreateServiceApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services`, method: 'POST', body: queryArg.body }),
    }),
    getJob: build.query<GetJobApiResponse, GetJobApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/jobs/${queryArg.jobId}` }),
    }),
    editJob: build.mutation<EditJobApiResponse, EditJobApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/jobs/${queryArg.jobId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteJob: build.mutation<DeleteJobApiResponse, DeleteJobApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/jobs/${queryArg.jobId}`, method: 'DELETE' }),
    }),
    getService: build.query<GetServiceApiResponse, GetServiceApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services/${queryArg.serviceId}` }),
    }),
    editService: build.mutation<EditServiceApiResponse, EditServiceApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/services/${queryArg.serviceId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteService: build.mutation<DeleteServiceApiResponse, DeleteServiceApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services/${queryArg.serviceId}`, method: 'DELETE' }),
    }),
    getSecrets: build.query<GetSecretsApiResponse, GetSecretsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/secrets` }),
    }),
    createSecret: build.mutation<CreateSecretApiResponse, CreateSecretApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/secrets`, method: 'POST', body: queryArg.body }),
    }),
    getSecret: build.query<GetSecretApiResponse, GetSecretApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/secrets/${queryArg.secretId}` }),
    }),
    editSecret: build.mutation<EditSecretApiResponse, EditSecretApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/secrets/${queryArg.secretId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteSecret: build.mutation<DeleteSecretApiResponse, DeleteSecretApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/secrets/${queryArg.secretId}`, method: 'DELETE' }),
    }),
    deploy: build.query<DeployApiResponse, DeployApiArg>({
      query: () => ({ url: `/deploy` }),
    }),
    downloadKubecfg: build.query<DownloadKubecfgApiResponse, DownloadKubecfgApiArg>({
      query: (queryArg) => ({ url: `/kubecfg/${queryArg.teamId}` }),
    }),
    getSession: build.query<GetSessionApiResponse, GetSessionApiArg>({
      query: () => ({ url: `/session` }),
    }),
    apiDocs: build.query<ApiDocsApiResponse, ApiDocsApiArg>({
      query: () => ({ url: `/apiDocs` }),
    }),
    getSettings: build.query<GetSettingsApiResponse, GetSettingsApiArg>({
      query: (queryArg) => ({ url: `/settings`, params: { ids: queryArg.ids } }),
    }),
    editSettings: build.mutation<EditSettingsApiResponse, EditSettingsApiArg>({
      query: (queryArg) => ({ url: `/settings/${queryArg.settingId}`, method: 'PUT', body: queryArg.body }),
    }),
    getApps: build.query<GetAppsApiResponse, GetAppsApiArg>({
      query: (queryArg) => ({ url: `/apps/${queryArg.teamId}`, params: { picks: queryArg.picks } }),
    }),
    toggleApps: build.mutation<ToggleAppsApiResponse, ToggleAppsApiArg>({
      query: (queryArg) => ({ url: `/apps/${queryArg.teamId}`, method: 'PUT', body: queryArg.body }),
    }),
    getApp: build.query<GetAppApiResponse, GetAppApiArg>({
      query: (queryArg) => ({ url: `/apps/${queryArg.teamId}/${queryArg.appId}` }),
    }),
    editApp: build.mutation<EditAppApiResponse, EditAppApiArg>({
      query: (queryArg) => ({ url: `/apps/${queryArg.teamId}/${queryArg.appId}`, method: 'PUT', body: queryArg.body }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as otomiApi }
export type GetAllSecretsApiResponse = /** status 200 Successfully obtained all secrets */ {
  id?: string
  name: string
  namespace?: string
  secret:
    | {
        type: 'generic'
        entries: string[]
      }
    | {
        type: 'docker-registry'
      }
    | {
        type: 'tls'
        crt: string
        key?: string
        ca?: string
      }
}[]
export type GetAllSecretsApiArg = void
export type GetAllJobsApiResponse = /** status 200 Successfully obtained all jobs */ ({
  id?: string
  teamId?: string
} & {
  name: string
  enabled?: boolean
  type: 'Job' | 'CronJob'
  script: string
  ttlSecondsAfterFinished?: number
  schedule?: string
  runPolicy?: 'Always' | 'OnSpecChange'
  init?: ({
    securityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      [key: string]: any
    }
  } & {
    image: {
      repository: string
    } & {
      tag: string
      pullPolicy?: 'IfNotPresent' | 'Always'
    }
    resources: {
      limits: {
        cpu: string
        memory: string
      }
      requests: {
        cpu: string
        memory: string
      }
    }
    env?:
      | {
          name: string
          value: string
        }[]
      | null
    secrets?: string[]
    secretMounts?: {
      name: string
      path: string
    }[]
    files?:
      | {
          path: string
          content: string
        }[]
      | null
    command?: string
    args?: string
  })[]
} & ({
    annotations?: {
      name?: string
      value?: string
    }[]
  } & {
    podSecurityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      fsGroup?: string
      fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
    }
  } & ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    })))[]
export type GetAllJobsApiArg = void
export type GetAllServicesApiResponse = /** status 200 Successfully obtained all services */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?:
    | {
        serviceType?: 'svcPredeployed'
      }
    | {
        serviceType?: 'ksvcPredeployed'
      }
    | ({
        annotations?: {
          name?: string
          value?: string
        }[]
      } & {
        securityContext?: {
          runAsUser?: number
          readOnlyRootFilesystem?: boolean
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      } & {
        serviceType: 'ksvc'
        scaleToZero?: boolean
        containerPort?: number
      })
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultSubdomain?: boolean
            subdomain: string
            domain: string
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
          } & {
            type?: 'public'
          })
        | null
      )
  networkPolicy?: {
    ingressPrivate?:
      | {
          mode: 'DenyAll'
        }
      | {
          mode: 'AllowOnly'
          allow: {
            team: string
            service?: string
          }[]
        }
      | {
          mode: 'AllowAll'
        }
    egressPublic?: {
      domain?: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }[]
  }
}[]
export type GetAllServicesApiArg = void
export type GetTeamsApiResponse = /** status 200 Successfully obtained teams collection */ {
  id?: string
  name: string
  oidc?: {
    groupMapping?: string
  }
  password?: string
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url: string
    }
    msteams?: {
      highPrio: string
      lowPrio: string
    }
    opsgenie?: {
      apiKey: string
      url: string
      responders?: ({
        type: 'team' | 'user' | 'escalation' | 'schedule'
      } & (
        | {
            id: string
          }
        | {
            name: string
          }
        | {
            username: string
          }
      ))[]
    }
    email?: {
      critical: string
      nonCritical: string
    }
  }
  resourceQuota?: {
    name: string
    value: string
  }[]
  azureMonitor?:
    | (
        | (object | null)
        | {
            appInsightsApiKey?: string
            appInsightsAppId?: string
            azureLogAnalyticsSameAs?: boolean
            clientId: string
            clientSecret: string
            logAnalyticsClientId?: string
            logAnalyticsClientSecret?: string
            logAnalyticsTenantId?: string
            logAnalyticsDefaultWorkspace?: string
            subscriptionId?: string
            tenantId?: string
          }
      )
    | null
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: ('alerts' | 'oidc' | 'resourceQuota' | 'downloadKubeConfig' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
  }
}[]
export type GetTeamsApiArg = void
export type CreateTeamApiResponse = /** status 200 Successfully obtained teams collection */ {
  id?: string
  name: string
  oidc?: {
    groupMapping?: string
  }
  password?: string
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url: string
    }
    msteams?: {
      highPrio: string
      lowPrio: string
    }
    opsgenie?: {
      apiKey: string
      url: string
      responders?: ({
        type: 'team' | 'user' | 'escalation' | 'schedule'
      } & (
        | {
            id: string
          }
        | {
            name: string
          }
        | {
            username: string
          }
      ))[]
    }
    email?: {
      critical: string
      nonCritical: string
    }
  }
  resourceQuota?: {
    name: string
    value: string
  }[]
  azureMonitor?:
    | (
        | (object | null)
        | {
            appInsightsApiKey?: string
            appInsightsAppId?: string
            azureLogAnalyticsSameAs?: boolean
            clientId: string
            clientSecret: string
            logAnalyticsClientId?: string
            logAnalyticsClientSecret?: string
            logAnalyticsTenantId?: string
            logAnalyticsDefaultWorkspace?: string
            subscriptionId?: string
            tenantId?: string
          }
      )
    | null
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: ('alerts' | 'oidc' | 'resourceQuota' | 'downloadKubeConfig' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
  }
}
export type CreateTeamApiArg = {
  /** Team object that needs to be added to the collection */
  body: {
    id?: string
    name: string
    oidc?: {
      groupMapping?: string
    }
    password?: string
    alerts?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url: string
      }
      msteams?: {
        highPrio: string
        lowPrio: string
      }
      opsgenie?: {
        apiKey: string
        url: string
        responders?: ({
          type: 'team' | 'user' | 'escalation' | 'schedule'
        } & (
          | {
              id: string
            }
          | {
              name: string
            }
          | {
              username: string
            }
        ))[]
      }
      email?: {
        critical: string
        nonCritical: string
      }
    }
    resourceQuota?: {
      name: string
      value: string
    }[]
    azureMonitor?:
      | (
          | (object | null)
          | {
              appInsightsApiKey?: string
              appInsightsAppId?: string
              azureLogAnalyticsSameAs?: boolean
              clientId: string
              clientSecret: string
              logAnalyticsClientId?: string
              logAnalyticsClientSecret?: string
              logAnalyticsTenantId?: string
              logAnalyticsDefaultWorkspace?: string
              subscriptionId?: string
              tenantId?: string
            }
        )
      | null
    networkPolicy?: {
      ingressPrivate?: boolean
      egressPublic?: boolean
    }
    selfService?: {
      service?: ('ingress' | 'networkPolicy')[]
      team?: ('alerts' | 'oidc' | 'resourceQuota' | 'downloadKubeConfig' | 'networkPolicy')[]
      apps?: ('argocd' | 'gitea')[]
    }
  }
}
export type GetTeamApiResponse = /** status 200 Successfully obtained team */ {
  id?: string
  name: string
  oidc?: {
    groupMapping?: string
  }
  password?: string
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url: string
    }
    msteams?: {
      highPrio: string
      lowPrio: string
    }
    opsgenie?: {
      apiKey: string
      url: string
      responders?: ({
        type: 'team' | 'user' | 'escalation' | 'schedule'
      } & (
        | {
            id: string
          }
        | {
            name: string
          }
        | {
            username: string
          }
      ))[]
    }
    email?: {
      critical: string
      nonCritical: string
    }
  }
  resourceQuota?: {
    name: string
    value: string
  }[]
  azureMonitor?:
    | (
        | (object | null)
        | {
            appInsightsApiKey?: string
            appInsightsAppId?: string
            azureLogAnalyticsSameAs?: boolean
            clientId: string
            clientSecret: string
            logAnalyticsClientId?: string
            logAnalyticsClientSecret?: string
            logAnalyticsTenantId?: string
            logAnalyticsDefaultWorkspace?: string
            subscriptionId?: string
            tenantId?: string
          }
      )
    | null
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: ('alerts' | 'oidc' | 'resourceQuota' | 'downloadKubeConfig' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
  }
}
export type GetTeamApiArg = {
  /** ID of team to return */
  teamId: string
}
export type EditTeamApiResponse = /** status 200 Successfully edited team */ {
  id?: string
  name: string
  oidc?: {
    groupMapping?: string
  }
  password?: string
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url: string
    }
    msteams?: {
      highPrio: string
      lowPrio: string
    }
    opsgenie?: {
      apiKey: string
      url: string
      responders?: ({
        type: 'team' | 'user' | 'escalation' | 'schedule'
      } & (
        | {
            id: string
          }
        | {
            name: string
          }
        | {
            username: string
          }
      ))[]
    }
    email?: {
      critical: string
      nonCritical: string
    }
  }
  resourceQuota?: {
    name: string
    value: string
  }[]
  azureMonitor?:
    | (
        | (object | null)
        | {
            appInsightsApiKey?: string
            appInsightsAppId?: string
            azureLogAnalyticsSameAs?: boolean
            clientId: string
            clientSecret: string
            logAnalyticsClientId?: string
            logAnalyticsClientSecret?: string
            logAnalyticsTenantId?: string
            logAnalyticsDefaultWorkspace?: string
            subscriptionId?: string
            tenantId?: string
          }
      )
    | null
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: ('alerts' | 'oidc' | 'resourceQuota' | 'downloadKubeConfig' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
  }
}
export type EditTeamApiArg = {
  /** ID of team to return */
  teamId: string
  /** Team object that contains updated values */
  body: {
    id?: string
    name: string
    oidc?: {
      groupMapping?: string
    }
    password?: string
    alerts?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url: string
      }
      msteams?: {
        highPrio: string
        lowPrio: string
      }
      opsgenie?: {
        apiKey: string
        url: string
        responders?: ({
          type: 'team' | 'user' | 'escalation' | 'schedule'
        } & (
          | {
              id: string
            }
          | {
              name: string
            }
          | {
              username: string
            }
        ))[]
      }
      email?: {
        critical: string
        nonCritical: string
      }
    }
    resourceQuota?: {
      name: string
      value: string
    }[]
    azureMonitor?:
      | (
          | (object | null)
          | {
              appInsightsApiKey?: string
              appInsightsAppId?: string
              azureLogAnalyticsSameAs?: boolean
              clientId: string
              clientSecret: string
              logAnalyticsClientId?: string
              logAnalyticsClientSecret?: string
              logAnalyticsTenantId?: string
              logAnalyticsDefaultWorkspace?: string
              subscriptionId?: string
              tenantId?: string
            }
        )
      | null
    networkPolicy?: {
      ingressPrivate?: boolean
      egressPublic?: boolean
    }
    selfService?: {
      service?: ('ingress' | 'networkPolicy')[]
      team?: ('alerts' | 'oidc' | 'resourceQuota' | 'downloadKubeConfig' | 'networkPolicy')[]
      apps?: ('argocd' | 'gitea')[]
    }
  }
}
export type DeleteTeamApiResponse = /** status 200 Successfully deleted a team */ undefined
export type DeleteTeamApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetTeamJobsApiResponse = /** status 200 Successfully obtained jobs */ ({
  id?: string
  teamId?: string
} & {
  name: string
  enabled?: boolean
  type: 'Job' | 'CronJob'
  script: string
  ttlSecondsAfterFinished?: number
  schedule?: string
  runPolicy?: 'Always' | 'OnSpecChange'
  init?: ({
    securityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      [key: string]: any
    }
  } & {
    image: {
      repository: string
    } & {
      tag: string
      pullPolicy?: 'IfNotPresent' | 'Always'
    }
    resources: {
      limits: {
        cpu: string
        memory: string
      }
      requests: {
        cpu: string
        memory: string
      }
    }
    env?:
      | {
          name: string
          value: string
        }[]
      | null
    secrets?: string[]
    secretMounts?: {
      name: string
      path: string
    }[]
    files?:
      | {
          path: string
          content: string
        }[]
      | null
    command?: string
    args?: string
  })[]
} & ({
    annotations?: {
      name?: string
      value?: string
    }[]
  } & {
    podSecurityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      fsGroup?: string
      fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
    }
  } & ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    })))[]
export type GetTeamJobsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateJobApiResponse = /** status 200 Successfully stored job configuration */ {
  id?: string
  teamId?: string
} & {
  name: string
  enabled?: boolean
  type: 'Job' | 'CronJob'
  script: string
  ttlSecondsAfterFinished?: number
  schedule?: string
  runPolicy?: 'Always' | 'OnSpecChange'
  init?: ({
    securityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      [key: string]: any
    }
  } & {
    image: {
      repository: string
    } & {
      tag: string
      pullPolicy?: 'IfNotPresent' | 'Always'
    }
    resources: {
      limits: {
        cpu: string
        memory: string
      }
      requests: {
        cpu: string
        memory: string
      }
    }
    env?:
      | {
          name: string
          value: string
        }[]
      | null
    secrets?: string[]
    secretMounts?: {
      name: string
      path: string
    }[]
    files?:
      | {
          path: string
          content: string
        }[]
      | null
    command?: string
    args?: string
  })[]
} & ({
    annotations?: {
      name?: string
      value?: string
    }[]
  } & {
    podSecurityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      fsGroup?: string
      fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
    }
  } & ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    }))
export type CreateJobApiArg = {
  /** ID of team to return */
  teamId: string
  /** Job object */
  body: {
    id?: string
    teamId?: string
  } & {
    name: string
    enabled?: boolean
    type: 'Job' | 'CronJob'
    script: string
    ttlSecondsAfterFinished?: number
    schedule?: string
    runPolicy?: 'Always' | 'OnSpecChange'
    init?: ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    })[]
  } & ({
      annotations?: {
        name?: string
        value?: string
      }[]
    } & {
      podSecurityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        fsGroup?: string
        fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
      }
    } & ({
        securityContext?: {
          runAsUser?: number
          runAsGroup?: number
          runAsNonRoot?: boolean
          [key: string]: any
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      }))
}
export type GetTeamServicesApiResponse = /** status 200 Successfully obtained services */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?:
    | {
        serviceType?: 'svcPredeployed'
      }
    | {
        serviceType?: 'ksvcPredeployed'
      }
    | ({
        annotations?: {
          name?: string
          value?: string
        }[]
      } & {
        securityContext?: {
          runAsUser?: number
          readOnlyRootFilesystem?: boolean
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      } & {
        serviceType: 'ksvc'
        scaleToZero?: boolean
        containerPort?: number
      })
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultSubdomain?: boolean
            subdomain: string
            domain: string
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
          } & {
            type?: 'public'
          })
        | null
      )
  networkPolicy?: {
    ingressPrivate?:
      | {
          mode: 'DenyAll'
        }
      | {
          mode: 'AllowOnly'
          allow: {
            team: string
            service?: string
          }[]
        }
      | {
          mode: 'AllowAll'
        }
    egressPublic?: {
      domain?: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }[]
  }
}[]
export type GetTeamServicesApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateServiceApiResponse = /** status 200 Successfully stored service configuration */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?:
    | {
        serviceType?: 'svcPredeployed'
      }
    | {
        serviceType?: 'ksvcPredeployed'
      }
    | ({
        annotations?: {
          name?: string
          value?: string
        }[]
      } & {
        securityContext?: {
          runAsUser?: number
          readOnlyRootFilesystem?: boolean
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      } & {
        serviceType: 'ksvc'
        scaleToZero?: boolean
        containerPort?: number
      })
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultSubdomain?: boolean
            subdomain: string
            domain: string
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
          } & {
            type?: 'public'
          })
        | null
      )
  networkPolicy?: {
    ingressPrivate?:
      | {
          mode: 'DenyAll'
        }
      | {
          mode: 'AllowOnly'
          allow: {
            team: string
            service?: string
          }[]
        }
      | {
          mode: 'AllowAll'
        }
    egressPublic?: {
      domain?: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }[]
  }
}
export type CreateServiceApiArg = {
  /** ID of team to return */
  teamId: string
  /** Service object */
  body: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?:
      | {
          serviceType?: 'svcPredeployed'
        }
      | {
          serviceType?: 'ksvcPredeployed'
        }
      | ({
          annotations?: {
            name?: string
            value?: string
          }[]
        } & {
          securityContext?: {
            runAsUser?: number
            readOnlyRootFilesystem?: boolean
          }
        } & {
          image: {
            repository: string
          } & {
            tag: string
            pullPolicy?: 'IfNotPresent' | 'Always'
          }
          resources: {
            limits: {
              cpu: string
              memory: string
            }
            requests: {
              cpu: string
              memory: string
            }
          }
          env?:
            | {
                name: string
                value: string
              }[]
            | null
          secrets?: string[]
          secretMounts?: {
            name: string
            path: string
          }[]
          files?:
            | {
                path: string
                content: string
              }[]
            | null
          command?: string
          args?: string
        } & {
          serviceType: 'ksvc'
          scaleToZero?: boolean
          containerPort?: number
        })
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultSubdomain?: boolean
              subdomain: string
              domain: string
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
            } & {
              type?: 'public'
            })
          | null
        )
    networkPolicy?: {
      ingressPrivate?:
        | {
            mode: 'DenyAll'
          }
        | {
            mode: 'AllowOnly'
            allow: {
              team: string
              service?: string
            }[]
          }
        | {
            mode: 'AllowAll'
          }
      egressPublic?: {
        domain?: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}
export type GetJobApiResponse = /** status 200 Successfully obtained job configuration */ {
  id?: string
  teamId?: string
} & {
  name: string
  enabled?: boolean
  type: 'Job' | 'CronJob'
  script: string
  ttlSecondsAfterFinished?: number
  schedule?: string
  runPolicy?: 'Always' | 'OnSpecChange'
  init?: ({
    securityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      [key: string]: any
    }
  } & {
    image: {
      repository: string
    } & {
      tag: string
      pullPolicy?: 'IfNotPresent' | 'Always'
    }
    resources: {
      limits: {
        cpu: string
        memory: string
      }
      requests: {
        cpu: string
        memory: string
      }
    }
    env?:
      | {
          name: string
          value: string
        }[]
      | null
    secrets?: string[]
    secretMounts?: {
      name: string
      path: string
    }[]
    files?:
      | {
          path: string
          content: string
        }[]
      | null
    command?: string
    args?: string
  })[]
} & ({
    annotations?: {
      name?: string
      value?: string
    }[]
  } & {
    podSecurityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      fsGroup?: string
      fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
    }
  } & ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    }))
export type GetJobApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the job */
  jobId: string
}
export type EditJobApiResponse = /** status 200 Successfully edited job */ {
  id?: string
  teamId?: string
} & {
  name: string
  enabled?: boolean
  type: 'Job' | 'CronJob'
  script: string
  ttlSecondsAfterFinished?: number
  schedule?: string
  runPolicy?: 'Always' | 'OnSpecChange'
  init?: ({
    securityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      [key: string]: any
    }
  } & {
    image: {
      repository: string
    } & {
      tag: string
      pullPolicy?: 'IfNotPresent' | 'Always'
    }
    resources: {
      limits: {
        cpu: string
        memory: string
      }
      requests: {
        cpu: string
        memory: string
      }
    }
    env?:
      | {
          name: string
          value: string
        }[]
      | null
    secrets?: string[]
    secretMounts?: {
      name: string
      path: string
    }[]
    files?:
      | {
          path: string
          content: string
        }[]
      | null
    command?: string
    args?: string
  })[]
} & ({
    annotations?: {
      name?: string
      value?: string
    }[]
  } & {
    podSecurityContext?: {
      runAsUser?: number
      runAsGroup?: number
      runAsNonRoot?: boolean
      fsGroup?: string
      fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
    }
  } & ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    }))
export type EditJobApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the job */
  jobId: string
  /** Job object that contains updated values */
  body: {
    id?: string
    teamId?: string
  } & {
    name: string
    enabled?: boolean
    type: 'Job' | 'CronJob'
    script: string
    ttlSecondsAfterFinished?: number
    schedule?: string
    runPolicy?: 'Always' | 'OnSpecChange'
    init?: ({
      securityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        [key: string]: any
      }
    } & {
      image: {
        repository: string
      } & {
        tag: string
        pullPolicy?: 'IfNotPresent' | 'Always'
      }
      resources: {
        limits: {
          cpu: string
          memory: string
        }
        requests: {
          cpu: string
          memory: string
        }
      }
      env?:
        | {
            name: string
            value: string
          }[]
        | null
      secrets?: string[]
      secretMounts?: {
        name: string
        path: string
      }[]
      files?:
        | {
            path: string
            content: string
          }[]
        | null
      command?: string
      args?: string
    })[]
  } & ({
      annotations?: {
        name?: string
        value?: string
      }[]
    } & {
      podSecurityContext?: {
        runAsUser?: number
        runAsGroup?: number
        runAsNonRoot?: boolean
        fsGroup?: string
        fsGroupChangePolicy?: 'Always' | 'OnRootMismatch'
      }
    } & ({
        securityContext?: {
          runAsUser?: number
          runAsGroup?: number
          runAsNonRoot?: boolean
          [key: string]: any
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      }))
}
export type DeleteJobApiResponse = /** status 200 Successfully deleted a job */ undefined
export type DeleteJobApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the job */
  jobId: string
}
export type GetServiceApiResponse = /** status 200 Successfully obtained service configuration */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?:
    | {
        serviceType?: 'svcPredeployed'
      }
    | {
        serviceType?: 'ksvcPredeployed'
      }
    | ({
        annotations?: {
          name?: string
          value?: string
        }[]
      } & {
        securityContext?: {
          runAsUser?: number
          readOnlyRootFilesystem?: boolean
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      } & {
        serviceType: 'ksvc'
        scaleToZero?: boolean
        containerPort?: number
      })
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultSubdomain?: boolean
            subdomain: string
            domain: string
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
          } & {
            type?: 'public'
          })
        | null
      )
  networkPolicy?: {
    ingressPrivate?:
      | {
          mode: 'DenyAll'
        }
      | {
          mode: 'AllowOnly'
          allow: {
            team: string
            service?: string
          }[]
        }
      | {
          mode: 'AllowAll'
        }
    egressPublic?: {
      domain?: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }[]
  }
}
export type GetServiceApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the service */
  serviceId: string
}
export type EditServiceApiResponse = /** status 200 Successfully edited service */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?:
    | {
        serviceType?: 'svcPredeployed'
      }
    | {
        serviceType?: 'ksvcPredeployed'
      }
    | ({
        annotations?: {
          name?: string
          value?: string
        }[]
      } & {
        securityContext?: {
          runAsUser?: number
          readOnlyRootFilesystem?: boolean
        }
      } & {
        image: {
          repository: string
        } & {
          tag: string
          pullPolicy?: 'IfNotPresent' | 'Always'
        }
        resources: {
          limits: {
            cpu: string
            memory: string
          }
          requests: {
            cpu: string
            memory: string
          }
        }
        env?:
          | {
              name: string
              value: string
            }[]
          | null
        secrets?: string[]
        secretMounts?: {
          name: string
          path: string
        }[]
        files?:
          | {
              path: string
              content: string
            }[]
          | null
        command?: string
        args?: string
      } & {
        serviceType: 'ksvc'
        scaleToZero?: boolean
        containerPort?: number
      })
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultSubdomain?: boolean
            subdomain: string
            domain: string
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
          } & {
            type?: 'public'
          })
        | null
      )
  networkPolicy?: {
    ingressPrivate?:
      | {
          mode: 'DenyAll'
        }
      | {
          mode: 'AllowOnly'
          allow: {
            team: string
            service?: string
          }[]
        }
      | {
          mode: 'AllowAll'
        }
    egressPublic?: {
      domain?: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }[]
  }
}
export type EditServiceApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the service */
  serviceId: string
  /** Service object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?:
      | {
          serviceType?: 'svcPredeployed'
        }
      | {
          serviceType?: 'ksvcPredeployed'
        }
      | ({
          annotations?: {
            name?: string
            value?: string
          }[]
        } & {
          securityContext?: {
            runAsUser?: number
            readOnlyRootFilesystem?: boolean
          }
        } & {
          image: {
            repository: string
          } & {
            tag: string
            pullPolicy?: 'IfNotPresent' | 'Always'
          }
          resources: {
            limits: {
              cpu: string
              memory: string
            }
            requests: {
              cpu: string
              memory: string
            }
          }
          env?:
            | {
                name: string
                value: string
              }[]
            | null
          secrets?: string[]
          secretMounts?: {
            name: string
            path: string
          }[]
          files?:
            | {
                path: string
                content: string
              }[]
            | null
          command?: string
          args?: string
        } & {
          serviceType: 'ksvc'
          scaleToZero?: boolean
          containerPort?: number
        })
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultSubdomain?: boolean
              subdomain: string
              domain: string
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
            } & {
              type?: 'public'
            })
          | null
        )
    networkPolicy?: {
      ingressPrivate?:
        | {
            mode: 'DenyAll'
          }
        | {
            mode: 'AllowOnly'
            allow: {
              team: string
              service?: string
            }[]
          }
        | {
            mode: 'AllowAll'
          }
      egressPublic?: {
        domain?: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}
export type DeleteServiceApiResponse = /** status 200 Successfully deleted a service */ undefined
export type DeleteServiceApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the service */
  serviceId: string
}
export type GetSecretsApiResponse = /** status 200 Successfully obtained secrets */ {
  id?: string
  name: string
  namespace?: string
  secret:
    | {
        type: 'generic'
        entries: string[]
      }
    | {
        type: 'docker-registry'
      }
    | {
        type: 'tls'
        crt: string
        key?: string
        ca?: string
      }
}[]
export type GetSecretsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateSecretApiResponse = /** status 200 Successfully stored secret configuration */ {
  id?: string
  name: string
  namespace?: string
  secret:
    | {
        type: 'generic'
        entries: string[]
      }
    | {
        type: 'docker-registry'
      }
    | {
        type: 'tls'
        crt: string
        key?: string
        ca?: string
      }
}
export type CreateSecretApiArg = {
  /** ID of team */
  teamId: string
  /** Service object */
  body: {
    id?: string
    name: string
    namespace?: string
    secret:
      | {
          type: 'generic'
          entries: string[]
        }
      | {
          type: 'docker-registry'
        }
      | {
          type: 'tls'
          crt: string
          key?: string
          ca?: string
        }
  }
}
export type GetSecretApiResponse = /** status 200 Successfully obtained secret configuration */ {
  id?: string
  name: string
  namespace?: string
  secret:
    | {
        type: 'generic'
        entries: string[]
      }
    | {
        type: 'docker-registry'
      }
    | {
        type: 'tls'
        crt: string
        key?: string
        ca?: string
      }
}
export type GetSecretApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the secret */
  secretId: string
}
export type EditSecretApiResponse = /** status 200 Successfully edited a team secret */ {
  id?: string
  name: string
  namespace?: string
  secret:
    | {
        type: 'generic'
        entries: string[]
      }
    | {
        type: 'docker-registry'
      }
    | {
        type: 'tls'
        crt: string
        key?: string
        ca?: string
      }
}
export type EditSecretApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the secret */
  secretId: string
  /** Secret object that contains updated values */
  body: {
    id?: string
    name: string
    namespace?: string
    secret:
      | {
          type: 'generic'
          entries: string[]
        }
      | {
          type: 'docker-registry'
        }
      | {
          type: 'tls'
          crt: string
          key?: string
          ca?: string
        }
  }
}
export type DeleteSecretApiResponse = /** status 200 Successfully deleted a team secret */ undefined
export type DeleteSecretApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the secret */
  secretId: string
}
export type DeployApiResponse = /** status 202 Deployment has been triggered */ object
export type DeployApiArg = void
export type DownloadKubecfgApiResponse = /** status 200 Succesfully finished the download */ Blob
export type DownloadKubecfgApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetSessionApiResponse = /** status 200 Get the session for the logged in user */ {
  ca?: string
  core?: object
  isDirty?: boolean
  user?: {
    name: string
    email: string
    isAdmin: boolean
    authz: {
      [key: string]: {
        deniedAttributes: {
          [key: string]: string[]
        }
      }
    }
    teams: string[]
    roles: string[]
  }
  versions?: {
    core?: string
    api?: string
  }
}
export type GetSessionApiArg = void
export type ApiDocsApiResponse = /** status 200 The requested apiDoc. */ object
export type ApiDocsApiArg = void
export type GetSettingsApiResponse = /** status 200 The request is successful. */ {
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url: string
    }
    msteams?: {
      highPrio: string
      lowPrio: string
    }
    opsgenie?: {
      apiKey: string
      url: string
      responders?: ({
        type: 'team' | 'user' | 'escalation' | 'schedule'
      } & (
        | {
            id: string
          }
        | {
            name: string
          }
        | {
            username: string
          }
      ))[]
    }
    email?: {
      critical: string
      nonCritical: string
    }
  }
  cluster?: {
    name?: string
    domainSuffix?: string
    provider?: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'custom'
    k8sVersion?: '1.19' | '1.20' | '1.21' | '1.22' | '1.23'
    apiName?: string
    apiServer?: string
    owner?: string
    region?: string
    k8sContext?: string
  }
  backup?: {
    platformSchedule?: {
      enabled?: boolean
    }
  }
  home?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url: string
    }
    msteams?: {
      highPrio: string
      lowPrio: string
    }
    opsgenie?: {
      apiKey: string
      url: string
      responders?: ({
        type: 'team' | 'user' | 'escalation' | 'schedule'
      } & (
        | {
            id: string
          }
        | {
            name: string
          }
        | {
            username: string
          }
      ))[]
    }
    email?: {
      critical: string
      nonCritical: string
    }
  }
  azure?: {
    appgw?: {
      isManaged?: boolean
    }
    monitor?:
      | (
          | (object | null)
          | {
              appInsightsApiKey?: string
              appInsightsAppId?: string
              azureLogAnalyticsSameAs?: boolean
              clientId: string
              clientSecret: string
              logAnalyticsClientId?: string
              logAnalyticsClientSecret?: string
              logAnalyticsTenantId?: string
              logAnalyticsDefaultWorkspace?: string
              subscriptionId?: string
              tenantId?: string
            }
        )
      | null
    storageType?: {
      fast?: string
      standard?: string
    }
  }
  dns?: {
    zones?: string[]
    domainFilters?: string[]
    zoneIdFilters?: string[]
    provider?:
      | (object | null)
      | {
          aws: {
            credentials?: {
              secretKey?: string
              accessKey?: string
            }
            region: string
            role?: string
          }
        }
      | {
          azure: {
            resourceGroup: string
            hostedZoneName?: string
            tenantId: string
            subscriptionId: string
            aadClientId: string
            aadClientSecret: string
          }
        }
      | {
          'azure-private-dns': {
            resourceGroup: string
            hostedZoneName?: string
            tenantId: string
            subscriptionId: string
            aadClientId: string
            aadClientSecret: string
          }
        }
      | {
          cloudflare: {
            apiToken?: string
            apiSecret?: string
            email?: string
            proxied?: boolean
          }
        }
      | {
          digitalocean: {
            apiToken?: string
          }
        }
      | {
          google: {
            serviceAccountKey?: string
            project: string
          }
        }
      | {
          other: {
            name: string
            'external-dns': object
            'cert-manager': object
          }
        }
    entrypoint?: string
  }
  ingress?: {
    platformClass?: {
      className?: string
    } & {
      network?: 'public' | 'private'
      loadBalancerIP?: string
      loadBalancerRG?: string
      loadBalancerSubnet?: string
      sourceIpAddressFiltering?: string
    }
    classes?: ({
      className?: string
    } & {
      network?: 'public' | 'private'
      loadBalancerIP?: string
      loadBalancerRG?: string
      loadBalancerSubnet?: string
      sourceIpAddressFiltering?: string
    })[]
  }
  kms?: {
    sops?:
      | (object | null)
      | {
          provider?: 'aws'
          aws: {
            keys: string
            accessKey: string
            secretKey: string
            region?: string
          }
        }
      | {
          provider?: 'azure'
          azure: {
            keys: string
            clientId: string
            clientSecret: string
            tenantId?: string
          }
        }
      | {
          provider?: 'google'
          google: {
            keys: string
            accountJson: string
            project: string
          }
        }
      | {
          provider?: 'vault'
          vault: {
            keys: string
            token: string
          }
        }
  }
  oidc?: {
    issuer: string
    clientID: string
    clientSecret: string
    adminGroupID?: string
    teamAdminGroupID?: string
    usernameClaimMapper?: string
    subClaimMapper?: string
  }
  otomi?: {
    adminPassword?: string
    otomiCloudApikey?: string
    isActivatedOnOtomiCloud?: boolean
    additionalClusters?: {
      domainSuffix: string
      name: string
      provider: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'custom'
    }[]
    globalPullSecret?: {
      username?: string
      password?: string
      email?: string
      server?: string
    } | null
    hasCloudLB?: boolean
    hasExternalDNS?: boolean
    hasExternalIDP?: boolean
    isHomeMonitored?: boolean
    isMultitenant?: boolean
    nodeSelector?: {
      name?: string
      value?: string
    }[]
    version: string
  }
  policies?: {
    'banned-image-tags'?: {
      tags?: string[]
      enabled: boolean
    }
    'container-limits'?: {
      cpu?: string
      memory?: string
      enabled: boolean
    }
    'psp-allowed-repos'?: {
      repos?: string[]
      enabled: boolean
    }
    'psp-host-filesystem'?: {
      allowedHostPaths?: {
        pathPrefix: string
        readOnly: boolean
      }[]
      enabled: boolean
    }
    'psp-allowed-users'?: {
      runAsUser?: {
        rule: 'RunAsAny' | 'MustRunAsNonRoot' | 'MustRunAs'
        ranges?: {
          min: number
          max: number
        }[]
      }
      runAsGroup?: {
        rule?: 'RunAsAny' | 'MayRunAs' | 'MustRunAs'
        ranges?: {
          min: number
          max: number
        }[]
      }
      supplementalGroups?: {
        rule?: 'RunAsAny' | 'MayRunAs' | 'MustRunAs'
        ranges?: {
          min: number
          max: number
        }[]
      }
      fsGroup?: {
        rule?: 'RunAsAny' | 'MayRunAs' | 'MustRunAs'
        ranges?: {
          min: number
          max: number
        }[]
      }
      enabled: boolean
    }
    'psp-host-security'?: {
      enabled: boolean
    }
    'psp-host-networking-ports'?: {
      enabled: boolean
    }
    'psp-privileged'?: {
      enabled: boolean
    }
    'psp-capabilities'?: {
      enabled: boolean
      allowedCapabilities?: string[]
      requiredDropCapabilities?: string[]
    }
    'psp-forbidden-sysctls'?: {
      enabled: boolean
      forbiddenSysctls?: string[]
    }
    'psp-apparmor'?: {
      enabled: boolean
      allowedProfiles?: string[]
    }
    'psp-seccomp'?: {
      enabled: boolean
      allowedProfiles?: string[]
    }
    'psp-selinux'?: {
      enabled: boolean
      seLinuxContext?: 'MustRunAs' | 'RunAsAny'
      allowedSELinuxOptions?: {
        level?: string
        role?: string
        type?: string
        user?: string
      }[]
    }
  }
  smtp?: {
    auth_identity?: string
    auth_password?: string
    auth_secret?: string
    auth_username?: string
    from?: string
    hello?: string
    smarthost: string
  } | null
}
export type GetSettingsApiArg = {
  /** IDs of settings to return */
  ids?: string[]
}
export type EditSettingsApiResponse = /** status 200 Successfully edited settings. */ undefined
export type EditSettingsApiArg = {
  /** ID of the setting */
  settingId: string
  /** Put new settings. */
  body: {
    alerts?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url: string
      }
      msteams?: {
        highPrio: string
        lowPrio: string
      }
      opsgenie?: {
        apiKey: string
        url: string
        responders?: ({
          type: 'team' | 'user' | 'escalation' | 'schedule'
        } & (
          | {
              id: string
            }
          | {
              name: string
            }
          | {
              username: string
            }
        ))[]
      }
      email?: {
        critical: string
        nonCritical: string
      }
    }
    cluster?: {
      name?: string
      domainSuffix?: string
      provider?: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'custom'
      k8sVersion?: '1.19' | '1.20' | '1.21' | '1.22' | '1.23'
      apiName?: string
      apiServer?: string
      owner?: string
      region?: string
      k8sContext?: string
    }
    backup?: {
      platformSchedule?: {
        enabled?: boolean
      }
    }
    home?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url: string
      }
      msteams?: {
        highPrio: string
        lowPrio: string
      }
      opsgenie?: {
        apiKey: string
        url: string
        responders?: ({
          type: 'team' | 'user' | 'escalation' | 'schedule'
        } & (
          | {
              id: string
            }
          | {
              name: string
            }
          | {
              username: string
            }
        ))[]
      }
      email?: {
        critical: string
        nonCritical: string
      }
    }
    azure?: {
      appgw?: {
        isManaged?: boolean
      }
      monitor?:
        | (
            | (object | null)
            | {
                appInsightsApiKey?: string
                appInsightsAppId?: string
                azureLogAnalyticsSameAs?: boolean
                clientId: string
                clientSecret: string
                logAnalyticsClientId?: string
                logAnalyticsClientSecret?: string
                logAnalyticsTenantId?: string
                logAnalyticsDefaultWorkspace?: string
                subscriptionId?: string
                tenantId?: string
              }
          )
        | null
      storageType?: {
        fast?: string
        standard?: string
      }
    }
    dns?: {
      zones?: string[]
      domainFilters?: string[]
      zoneIdFilters?: string[]
      provider?:
        | (object | null)
        | {
            aws: {
              credentials?: {
                secretKey?: string
                accessKey?: string
              }
              region: string
              role?: string
            }
          }
        | {
            azure: {
              resourceGroup: string
              hostedZoneName?: string
              tenantId: string
              subscriptionId: string
              aadClientId: string
              aadClientSecret: string
            }
          }
        | {
            'azure-private-dns': {
              resourceGroup: string
              hostedZoneName?: string
              tenantId: string
              subscriptionId: string
              aadClientId: string
              aadClientSecret: string
            }
          }
        | {
            cloudflare: {
              apiToken?: string
              apiSecret?: string
              email?: string
              proxied?: boolean
            }
          }
        | {
            digitalocean: {
              apiToken?: string
            }
          }
        | {
            google: {
              serviceAccountKey?: string
              project: string
            }
          }
        | {
            other: {
              name: string
              'external-dns': object
              'cert-manager': object
            }
          }
      entrypoint?: string
    }
    ingress?: {
      platformClass?: {
        className?: string
      } & {
        network?: 'public' | 'private'
        loadBalancerIP?: string
        loadBalancerRG?: string
        loadBalancerSubnet?: string
        sourceIpAddressFiltering?: string
      }
      classes?: ({
        className?: string
      } & {
        network?: 'public' | 'private'
        loadBalancerIP?: string
        loadBalancerRG?: string
        loadBalancerSubnet?: string
        sourceIpAddressFiltering?: string
      })[]
    }
    kms?: {
      sops?:
        | (object | null)
        | {
            provider?: 'aws'
            aws: {
              keys: string
              accessKey: string
              secretKey: string
              region?: string
            }
          }
        | {
            provider?: 'azure'
            azure: {
              keys: string
              clientId: string
              clientSecret: string
              tenantId?: string
            }
          }
        | {
            provider?: 'google'
            google: {
              keys: string
              accountJson: string
              project: string
            }
          }
        | {
            provider?: 'vault'
            vault: {
              keys: string
              token: string
            }
          }
    }
    oidc?: {
      issuer: string
      clientID: string
      clientSecret: string
      adminGroupID?: string
      teamAdminGroupID?: string
      usernameClaimMapper?: string
      subClaimMapper?: string
    }
    otomi?: {
      adminPassword?: string
      additionalClusters?: {
        domainSuffix: string
        name: string
        provider: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'custom'
      }[]
      globalPullSecret?: {
        username?: string
        password?: string
        email?: string
        server?: string
      } | null
      hasCloudLB?: boolean
      hasExternalDNS?: boolean
      hasExternalIDP?: boolean
      isHomeMonitored?: boolean
      isMultitenant?: boolean
      nodeSelector?: {
        name?: string
        value?: string
      }[]
      version: string
    }
    policies?: {
      'banned-image-tags'?: {
        tags?: string[]
        enabled: boolean
      }
      'container-limits'?: {
        cpu?: string
        memory?: string
        enabled: boolean
      }
      'psp-allowed-repos'?: {
        repos?: string[]
        enabled: boolean
      }
      'psp-host-filesystem'?: {
        allowedHostPaths?: {
          pathPrefix: string
          readOnly: boolean
        }[]
        enabled: boolean
      }
      'psp-allowed-users'?: {
        runAsUser?: {
          rule: 'RunAsAny' | 'MustRunAsNonRoot' | 'MustRunAs'
          ranges?: {
            min: number
            max: number
          }[]
        }
        runAsGroup?: {
          rule?: 'RunAsAny' | 'MayRunAs' | 'MustRunAs'
          ranges?: {
            min: number
            max: number
          }[]
        }
        supplementalGroups?: {
          rule?: 'RunAsAny' | 'MayRunAs' | 'MustRunAs'
          ranges?: {
            min: number
            max: number
          }[]
        }
        fsGroup?: {
          rule?: 'RunAsAny' | 'MayRunAs' | 'MustRunAs'
          ranges?: {
            min: number
            max: number
          }[]
        }
        enabled: boolean
      }
      'psp-host-security'?: {
        enabled: boolean
      }
      'psp-host-networking-ports'?: {
        enabled: boolean
      }
      'psp-privileged'?: {
        enabled: boolean
      }
      'psp-capabilities'?: {
        enabled: boolean
        allowedCapabilities?: string[]
        requiredDropCapabilities?: string[]
      }
      'psp-forbidden-sysctls'?: {
        enabled: boolean
        forbiddenSysctls?: string[]
      }
      'psp-apparmor'?: {
        enabled: boolean
        allowedProfiles?: string[]
      }
      'psp-seccomp'?: {
        enabled: boolean
        allowedProfiles?: string[]
      }
      'psp-selinux'?: {
        enabled: boolean
        seLinuxContext?: 'MustRunAs' | 'RunAsAny'
        allowedSELinuxOptions?: {
          level?: string
          role?: string
          type?: string
          user?: string
        }[]
      }
    }
    smtp?: {
      auth_identity?: string
      auth_password?: string
      auth_secret?: string
      auth_username?: string
      from?: string
      hello?: string
      smarthost: string
    } | null
  }
}
export type GetAppsApiResponse = /** status 200 The request is successful. */ {
  enabled?: boolean
  id?: string
  rawValues?: object
  shortcuts?: {
    title: string
    description: string
    path: string
  }[]
  values?: object
}[]
export type GetAppsApiArg = {
  teamId: string
  /** Selection of properties to return. */
  picks?: string[]
}
export type ToggleAppsApiResponse = /** status 200 Successfully toggled apps */ undefined
export type ToggleAppsApiArg = {
  teamId: string
  /** App toggles */
  body: object
}
export type GetAppApiResponse = /** status 200 The request is successful. */ {
  enabled?: boolean
  id?: string
  rawValues?: object
  shortcuts?: {
    title: string
    description: string
    path: string
  }[]
  values?: object
}
export type GetAppApiArg = {
  teamId: string
  appId: string
}
export type EditAppApiResponse = /** status 200 Successfully edited app values. */ undefined
export type EditAppApiArg = {
  teamId: string
  appId: string
  /** Edit app values */
  body: {
    enabled?: boolean
    id?: string
    rawValues?: object
    shortcuts?: {
      title: string
      description: string
      path: string
    }[]
    values?: object
  }
}
export const {
  useGetAllSecretsQuery,
  useGetAllJobsQuery,
  useGetAllServicesQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetTeamQuery,
  useEditTeamMutation,
  useDeleteTeamMutation,
  useGetTeamJobsQuery,
  useCreateJobMutation,
  useGetTeamServicesQuery,
  useCreateServiceMutation,
  useGetJobQuery,
  useEditJobMutation,
  useDeleteJobMutation,
  useGetServiceQuery,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useGetSecretsQuery,
  useCreateSecretMutation,
  useGetSecretQuery,
  useEditSecretMutation,
  useDeleteSecretMutation,
  useDeployQuery,
  useDownloadKubecfgQuery,
  useGetSessionQuery,
  useApiDocsQuery,
  useGetSettingsQuery,
  useEditSettingsMutation,
  useGetAppsQuery,
  useToggleAppsMutation,
  useGetAppQuery,
  useEditAppMutation,
} = injectedRtkApi
