import { emptySplitApi as api } from './emptyApi'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    deleteLicense: build.mutation<DeleteLicenseApiResponse, DeleteLicenseApiArg>({
      query: () => ({ url: `/license`, method: 'DELETE' }),
    }),
    activateLicense: build.mutation<ActivateLicenseApiResponse, ActivateLicenseApiArg>({
      query: (queryArg) => ({ url: `/activate`, method: 'PUT', body: queryArg.body }),
    }),
    getMetrics: build.query<GetMetricsApiResponse, GetMetricsApiArg>({
      query: () => ({ url: `/metrics` }),
    }),
    getAllSecrets: build.query<GetAllSecretsApiResponse, GetAllSecretsApiArg>({
      query: () => ({ url: `/secrets` }),
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
    getTeamServices: build.query<GetTeamServicesApiResponse, GetTeamServicesApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services` }),
    }),
    createService: build.mutation<CreateServiceApiResponse, CreateServiceApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services`, method: 'POST', body: queryArg.body }),
    }),
    getTeamK8SServices: build.query<GetTeamK8SServicesApiResponse, GetTeamK8SServicesApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/kubernetes/services` }),
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
    getAllBackups: build.query<GetAllBackupsApiResponse, GetAllBackupsApiArg>({
      query: () => ({ url: `/backups` }),
    }),
    getTeamBackups: build.query<GetTeamBackupsApiResponse, GetTeamBackupsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/backups` }),
    }),
    createBackup: build.mutation<CreateBackupApiResponse, CreateBackupApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/backups`, method: 'POST', body: queryArg.body }),
    }),
    deleteBackup: build.mutation<DeleteBackupApiResponse, DeleteBackupApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/backups/${queryArg.backupId}`, method: 'DELETE' }),
    }),
    getBackup: build.query<GetBackupApiResponse, GetBackupApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/backups/${queryArg.backupId}` }),
    }),
    editBackup: build.mutation<EditBackupApiResponse, EditBackupApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/backups/${queryArg.backupId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllBuilds: build.query<GetAllBuildsApiResponse, GetAllBuildsApiArg>({
      query: () => ({ url: `/builds` }),
    }),
    getTeamBuilds: build.query<GetTeamBuildsApiResponse, GetTeamBuildsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/builds` }),
    }),
    createBuild: build.mutation<CreateBuildApiResponse, CreateBuildApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/builds`, method: 'POST', body: queryArg.body }),
    }),
    deleteBuild: build.mutation<DeleteBuildApiResponse, DeleteBuildApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/builds/${queryArg.buildId}`, method: 'DELETE' }),
    }),
    getBuild: build.query<GetBuildApiResponse, GetBuildApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/builds/${queryArg.buildId}` }),
    }),
    editBuild: build.mutation<EditBuildApiResponse, EditBuildApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/builds/${queryArg.buildId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getK8SVersion: build.query<GetK8SVersionApiResponse, GetK8SVersionApiArg>({
      query: () => ({ url: `/k8sVersion` }),
    }),
    connectCloudtty: build.mutation<ConnectCloudttyApiResponse, ConnectCloudttyApiArg>({
      query: (queryArg) => ({ url: `/cloudtty`, method: 'POST', body: queryArg.body }),
    }),
    deleteCloudtty: build.mutation<DeleteCloudttyApiResponse, DeleteCloudttyApiArg>({
      query: (queryArg) => ({ url: `/cloudtty`, method: 'DELETE', body: queryArg.body }),
    }),
    getAllProjects: build.query<GetAllProjectsApiResponse, GetAllProjectsApiArg>({
      query: () => ({ url: `/projects` }),
    }),
    getTeamProjects: build.query<GetTeamProjectsApiResponse, GetTeamProjectsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/projects` }),
    }),
    createProject: build.mutation<CreateProjectApiResponse, CreateProjectApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/projects`, method: 'POST', body: queryArg.body }),
    }),
    deleteProject: build.mutation<DeleteProjectApiResponse, DeleteProjectApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/projects/${queryArg.projectId}`, method: 'DELETE' }),
    }),
    getProject: build.query<GetProjectApiResponse, GetProjectApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/projects/${queryArg.projectId}` }),
    }),
    editProject: build.mutation<EditProjectApiResponse, EditProjectApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/projects/${queryArg.projectId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllWorkloads: build.query<GetAllWorkloadsApiResponse, GetAllWorkloadsApiArg>({
      query: () => ({ url: `/workloads` }),
    }),
    workloadCatalog: build.mutation<WorkloadCatalogApiResponse, WorkloadCatalogApiArg>({
      query: (queryArg) => ({ url: `/workloadCatalog`, method: 'POST', body: queryArg.body }),
    }),
    getTeamWorkloads: build.query<GetTeamWorkloadsApiResponse, GetTeamWorkloadsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads` }),
    }),
    createWorkload: build.mutation<CreateWorkloadApiResponse, CreateWorkloadApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads`, method: 'POST', body: queryArg.body }),
    }),
    deleteWorkload: build.mutation<DeleteWorkloadApiResponse, DeleteWorkloadApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadId}`, method: 'DELETE' }),
    }),
    getWorkload: build.query<GetWorkloadApiResponse, GetWorkloadApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadId}` }),
    }),
    editWorkload: build.mutation<EditWorkloadApiResponse, EditWorkloadApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getWorkloadValues: build.query<GetWorkloadValuesApiResponse, GetWorkloadValuesApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadId}/values` }),
    }),
    editWorkloadValues: build.mutation<EditWorkloadValuesApiResponse, EditWorkloadValuesApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadId}/values`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    updateWorkloadValues: build.mutation<UpdateWorkloadValuesApiResponse, UpdateWorkloadValuesApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadId}/values`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    deploy: build.query<DeployApiResponse, DeployApiArg>({
      query: () => ({ url: `/deploy` }),
    }),
    revert: build.query<RevertApiResponse, RevertApiArg>({
      query: () => ({ url: `/revert` }),
    }),
    restore: build.query<RestoreApiResponse, RestoreApiArg>({
      query: () => ({ url: `/restore` }),
    }),
    downloadKubecfg: build.query<DownloadKubecfgApiResponse, DownloadKubecfgApiArg>({
      query: (queryArg) => ({ url: `/kubecfg/${queryArg.teamId}` }),
    }),
    downloadDockerConfig: build.query<DownloadDockerConfigApiResponse, DownloadDockerConfigApiArg>({
      query: (queryArg) => ({ url: `/dockerconfig/${queryArg.teamId}` }),
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
export type DeleteLicenseApiResponse = unknown
export type DeleteLicenseApiArg = void
export type ActivateLicenseApiResponse = /** status 200 Uploaded license */ {
  isValid: boolean
  hasLicense: boolean
  jwt?: string
  body?: {
    version: number
    key: string
    envType?: 'dev' | 'prod' | 'local'
    type: 'community' | 'professional' | 'enterprise'
    capabilities: {
      teams: number
      services: number
      workloads: number
    }
  }
}
export type ActivateLicenseApiArg = {
  /** License JWT */
  body: {
    jwt: string
  }
}
export type GetMetricsApiResponse = /** status 200 Successfully obtained otomi metrics */ {
  otomi_backups: number
  otomi_builds: number
  otomi_secrets: number
  otomi_services: number
  otomi_teams: number
  otomi_workloads: number
}
export type GetMetricsApiArg = void
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
export type GetAllServicesApiResponse = /** status 200 Successfully obtained all services */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?: {
    predeployed?: boolean
  }
  trafficControl?: {
    enabled?: boolean
    weightV1?: number
    weightV2?: number
  }
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultHost?: boolean
            subdomain: string
            domain: string
            useCname?: boolean
            cname?: {
              domain?: string
              tlsSecretName?: string
            }
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
            headers?: {
              response?: {
                set?: {
                  name: string
                  value: string
                }[]
              }
            }
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
      domain: string
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
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
    opsgenie?: {
      apiKey?: string
      url?: string
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
      critical?: string
      nonCritical?: string
    }
  }
  billingAlertQuotas?: {
    teamCpuMonthQuotaReached?: {
      quota?: number
    }
    teamMemMonthQuotaReached?: {
      quota?: number
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
  monitoringStack?: {
    enabled?: boolean
  }
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: (
      | 'alerts'
      | 'backup'
      | 'billingAlertQuotas'
      | 'oidc'
      | 'resourceQuota'
      | 'downloadKubeConfig'
      | 'downloadDockerConfig'
      | 'networkPolicy'
    )[]
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
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
    opsgenie?: {
      apiKey?: string
      url?: string
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
      critical?: string
      nonCritical?: string
    }
  }
  billingAlertQuotas?: {
    teamCpuMonthQuotaReached?: {
      quota?: number
    }
    teamMemMonthQuotaReached?: {
      quota?: number
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
  monitoringStack?: {
    enabled?: boolean
  }
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: (
      | 'alerts'
      | 'backup'
      | 'billingAlertQuotas'
      | 'oidc'
      | 'resourceQuota'
      | 'downloadKubeConfig'
      | 'downloadDockerConfig'
      | 'networkPolicy'
    )[]
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
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
      }
      opsgenie?: {
        apiKey?: string
        url?: string
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
        critical?: string
        nonCritical?: string
      }
    }
    billingAlertQuotas?: {
      teamCpuMonthQuotaReached?: {
        quota?: number
      }
      teamMemMonthQuotaReached?: {
        quota?: number
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
    monitoringStack?: {
      enabled?: boolean
    }
    networkPolicy?: {
      ingressPrivate?: boolean
      egressPublic?: boolean
    }
    selfService?: {
      service?: ('ingress' | 'networkPolicy')[]
      team?: (
        | 'alerts'
        | 'backup'
        | 'billingAlertQuotas'
        | 'oidc'
        | 'resourceQuota'
        | 'downloadKubeConfig'
        | 'downloadDockerConfig'
        | 'networkPolicy'
      )[]
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
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
    opsgenie?: {
      apiKey?: string
      url?: string
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
      critical?: string
      nonCritical?: string
    }
  }
  billingAlertQuotas?: {
    teamCpuMonthQuotaReached?: {
      quota?: number
    }
    teamMemMonthQuotaReached?: {
      quota?: number
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
  monitoringStack?: {
    enabled?: boolean
  }
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: (
      | 'alerts'
      | 'backup'
      | 'billingAlertQuotas'
      | 'oidc'
      | 'resourceQuota'
      | 'downloadKubeConfig'
      | 'downloadDockerConfig'
      | 'networkPolicy'
    )[]
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
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
    opsgenie?: {
      apiKey?: string
      url?: string
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
      critical?: string
      nonCritical?: string
    }
  }
  billingAlertQuotas?: {
    teamCpuMonthQuotaReached?: {
      quota?: number
    }
    teamMemMonthQuotaReached?: {
      quota?: number
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
  monitoringStack?: {
    enabled?: boolean
  }
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: ('ingress' | 'networkPolicy')[]
    team?: (
      | 'alerts'
      | 'backup'
      | 'billingAlertQuotas'
      | 'oidc'
      | 'resourceQuota'
      | 'downloadKubeConfig'
      | 'downloadDockerConfig'
      | 'networkPolicy'
    )[]
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
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
      }
      opsgenie?: {
        apiKey?: string
        url?: string
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
        critical?: string
        nonCritical?: string
      }
    }
    billingAlertQuotas?: {
      teamCpuMonthQuotaReached?: {
        quota?: number
      }
      teamMemMonthQuotaReached?: {
        quota?: number
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
    monitoringStack?: {
      enabled?: boolean
    }
    networkPolicy?: {
      ingressPrivate?: boolean
      egressPublic?: boolean
    }
    selfService?: {
      service?: ('ingress' | 'networkPolicy')[]
      team?: (
        | 'alerts'
        | 'backup'
        | 'billingAlertQuotas'
        | 'oidc'
        | 'resourceQuota'
        | 'downloadKubeConfig'
        | 'downloadDockerConfig'
        | 'networkPolicy'
      )[]
      apps?: ('argocd' | 'gitea')[]
    }
  }
}
export type DeleteTeamApiResponse = /** status 200 Successfully deleted a team */ undefined
export type DeleteTeamApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetTeamServicesApiResponse = /** status 200 Successfully obtained services */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?: {
    predeployed?: boolean
  }
  trafficControl?: {
    enabled?: boolean
    weightV1?: number
    weightV2?: number
  }
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultHost?: boolean
            subdomain: string
            domain: string
            useCname?: boolean
            cname?: {
              domain?: string
              tlsSecretName?: string
            }
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
            headers?: {
              response?: {
                set?: {
                  name: string
                  value: string
                }[]
              }
            }
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
      domain: string
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
  ksvc?: {
    predeployed?: boolean
  }
  trafficControl?: {
    enabled?: boolean
    weightV1?: number
    weightV2?: number
  }
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultHost?: boolean
            subdomain: string
            domain: string
            useCname?: boolean
            cname?: {
              domain?: string
              tlsSecretName?: string
            }
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
            headers?: {
              response?: {
                set?: {
                  name: string
                  value: string
                }[]
              }
            }
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
      domain: string
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
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}
export type GetTeamK8SServicesApiResponse = /** status 200 Successfully obtained kuberntes services */ {
  name: string
  ports?: number[]
  managedByKnative?: boolean
}[]
export type GetTeamK8SServicesApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetServiceApiResponse = /** status 200 Successfully obtained service configuration */ {
  id?: string
  teamId?: string
  name: string
  namespace?: string
  port?: number
  ksvc?: {
    predeployed?: boolean
  }
  trafficControl?: {
    enabled?: boolean
    weightV1?: number
    weightV2?: number
  }
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultHost?: boolean
            subdomain: string
            domain: string
            useCname?: boolean
            cname?: {
              domain?: string
              tlsSecretName?: string
            }
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
            headers?: {
              response?: {
                set?: {
                  name: string
                  value: string
                }[]
              }
            }
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
      domain: string
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
  ksvc?: {
    predeployed?: boolean
  }
  trafficControl?: {
    enabled?: boolean
    weightV1?: number
    weightV2?: number
  }
  ingress:
    | ({
        type?: 'cluster'
      } | null)
    | (
        | ({
            ingressClassName?: string
            tlsPass?: boolean
            useDefaultHost?: boolean
            subdomain: string
            domain: string
            useCname?: boolean
            cname?: {
              domain?: string
              tlsSecretName?: string
            }
            paths?: string[]
            forwardPath?: boolean
            hasCert?: boolean
            certSelect?: boolean
            certName?: string
            certArn?: string
            headers?: {
              response?: {
                set?: {
                  name: string
                  value: string
                }[]
              }
            }
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
      domain: string
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
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
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
export type GetAllBackupsApiResponse = /** status 200 Successfully obtained all backups configuration */ {
  id?: string
  teamId?: string
  name: string
  schedule: string
  snapshotVolumes?: boolean
  labelSelector?: {
    name?: string
    value?: string
  }[]
  ttl: string
}[]
export type GetAllBackupsApiArg = void
export type GetTeamBackupsApiResponse = /** status 200 Successfully obtained team backups configuration */ {
  id?: string
  teamId?: string
  name: string
  schedule: string
  snapshotVolumes?: boolean
  labelSelector?: {
    name?: string
    value?: string
  }[]
  ttl: string
}[]
export type GetTeamBackupsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateBackupApiResponse = /** status 200 Successfully stored backup configuration */ {
  id?: string
  teamId?: string
  name: string
  schedule: string
  snapshotVolumes?: boolean
  labelSelector?: {
    name?: string
    value?: string
  }[]
  ttl: string
}
export type CreateBackupApiArg = {
  /** ID of team to return */
  teamId: string
  /** Backup object */
  body: {
    id?: string
    teamId?: string
    name: string
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
}
export type DeleteBackupApiResponse = /** status 200 Successfully deleted a backup */ undefined
export type DeleteBackupApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the backup */
  backupId: string
}
export type GetBackupApiResponse = /** status 200 Successfully obtained backup configuration */ {
  id?: string
  teamId?: string
  name: string
  schedule: string
  snapshotVolumes?: boolean
  labelSelector?: {
    name?: string
    value?: string
  }[]
  ttl: string
}
export type GetBackupApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the backup */
  backupId: string
}
export type EditBackupApiResponse = /** status 200 Successfully edited a team backup */ {
  id?: string
  teamId?: string
  name: string
  schedule: string
  snapshotVolumes?: boolean
  labelSelector?: {
    name?: string
    value?: string
  }[]
  ttl: string
}
export type EditBackupApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the backup */
  backupId: string
  /** Backup object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
}
export type GetAllBuildsApiResponse = /** status 200 Successfully obtained all builds configuration */ {
  id?: string
  teamId?: string
  name: string
  tag?: string
  mode?:
    | {
        docker: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretSelect?: boolean
  secretName?: string
  trigger?: boolean
}[]
export type GetAllBuildsApiArg = void
export type GetTeamBuildsApiResponse = /** status 200 Successfully obtained team builds configuration */ {
  id?: string
  teamId?: string
  name: string
  tag?: string
  mode?:
    | {
        docker: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretSelect?: boolean
  secretName?: string
  trigger?: boolean
}[]
export type GetTeamBuildsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateBuildApiResponse = /** status 200 Successfully stored build configuration */ {
  id?: string
  teamId?: string
  name: string
  tag?: string
  mode?:
    | {
        docker: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretSelect?: boolean
  secretName?: string
  trigger?: boolean
}
export type CreateBuildApiArg = {
  /** ID of team to return */
  teamId: string
  /** Build object */
  body: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
}
export type DeleteBuildApiResponse = /** status 200 Successfully deleted a build */ undefined
export type DeleteBuildApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the build */
  buildId: string
}
export type GetBuildApiResponse = /** status 200 Successfully obtained build configuration */ {
  id?: string
  teamId?: string
  name: string
  tag?: string
  mode?:
    | {
        docker: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretSelect?: boolean
  secretName?: string
  trigger?: boolean
}
export type GetBuildApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the build */
  buildId: string
}
export type EditBuildApiResponse = /** status 200 Successfully edited a team build */ {
  id?: string
  teamId?: string
  name: string
  tag?: string
  mode?:
    | {
        docker: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretSelect?: boolean
  secretName?: string
  trigger?: boolean
}
export type EditBuildApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the build */
  buildId: string
  /** Build object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
}
export type GetK8SVersionApiResponse = /** status 200 Successfully obtained k8s version */ string
export type GetK8SVersionApiArg = void
export type ConnectCloudttyApiResponse = /** status 200 Successfully stored cloudtty configuration */ {
  id?: string
  teamId: string
  domain: string
  emailNoSymbols: string
  iFrameUrl?: string
  isAdmin: boolean
  userTeams?: string[]
  sub?: string
}
export type ConnectCloudttyApiArg = {
  /** Cloudtty object */
  body: {
    id?: string
    teamId: string
    domain: string
    emailNoSymbols: string
    iFrameUrl?: string
    isAdmin: boolean
    userTeams?: string[]
    sub?: string
  }
}
export type DeleteCloudttyApiResponse = unknown
export type DeleteCloudttyApiArg = {
  /** Cloudtty object */
  body: {
    id?: string
    teamId: string
    domain: string
    emailNoSymbols: string
    iFrameUrl?: string
    isAdmin: boolean
    userTeams?: string[]
    sub?: string
  }
}
export type GetAllProjectsApiResponse = /** status 200 Successfully obtained all projects configuration */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
  workload?: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
  workloadValues?: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
  service?: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}[]
export type GetAllProjectsApiArg = void
export type GetTeamProjectsApiResponse = /** status 200 Successfully obtained team projects configuration */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
  workload?: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
  workloadValues?: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
  service?: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}[]
export type GetTeamProjectsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateProjectApiResponse = /** status 200 Successfully stored project configuration */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
  workload?: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
  workloadValues?: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
  service?: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}
export type CreateProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** Project object */
  body: {
    id?: string
    teamId?: string
    name: string
    build?: {
      id?: string
      teamId?: string
      name: string
      tag?: string
      mode?:
        | {
            docker: {
              repoUrl: string
              path?: string
              revision?: string
            }
            type: 'docker'
          }
        | {
            buildpacks: {
              repoUrl: string
              path?: string
              revision?: string
            }
            type: 'buildpacks'
          }
      externalRepo?: boolean
      secretSelect?: boolean
      secretName?: string
      trigger?: boolean
    }
    workload?: {
      id?: string
      teamId?: string
      name: string
      icon?: string
      url: string
      chartProvider?: 'helm' | 'git'
      path?: string
      chart?: string
      revision?: string
      chartMetadata?: {
        helmChartVersion?: string
        helmChartDescription?: string
      }
      namespace?: string
      imageUpdateStrategy?:
        | {
            type?: 'disabled'
          }
        | {
            digest?: {
              imageRepository: string
              tag: string
              imageParameter?: string
              tagParameter?: string
            }
            type?: 'digest'
          }
        | {
            semver?: {
              imageRepository: string
              versionConstraint: string
              imageParameter?: string
              tagParameter?: string
            }
            type?: 'semver'
          }
    }
    workloadValues?: {
      id?: string
      teamId?: string
      name?: string
      values: object
    }
    service?: {
      id?: string
      teamId?: string
      name: string
      namespace?: string
      port?: number
      ksvc?: {
        predeployed?: boolean
      }
      trafficControl?: {
        enabled?: boolean
        weightV1?: number
        weightV2?: number
      }
      ingress:
        | ({
            type?: 'cluster'
          } | null)
        | (
            | ({
                ingressClassName?: string
                tlsPass?: boolean
                useDefaultHost?: boolean
                subdomain: string
                domain: string
                useCname?: boolean
                cname?: {
                  domain?: string
                  tlsSecretName?: string
                }
                paths?: string[]
                forwardPath?: boolean
                hasCert?: boolean
                certSelect?: boolean
                certName?: string
                certArn?: string
                headers?: {
                  response?: {
                    set?: {
                      name: string
                      value: string
                    }[]
                  }
                }
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
          domain: string
          ports?: {
            number: number
            protocol: 'HTTPS' | 'HTTP' | 'TCP'
          }[]
        }[]
      }
    }
  }
}
export type DeleteProjectApiResponse = /** status 200 Successfully deleted a project */ undefined
export type DeleteProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the build */
  projectId: string
}
export type GetProjectApiResponse = /** status 200 Successfully obtained project configuration */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
  workload?: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
  workloadValues?: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
  service?: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}
export type GetProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the build */
  projectId: string
}
export type EditProjectApiResponse = /** status 200 Successfully edited a team project */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    tag?: string
    mode?:
      | {
          docker: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretSelect?: boolean
    secretName?: string
    trigger?: boolean
  }
  workload?: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
  workloadValues?: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
  service?: {
    id?: string
    teamId?: string
    name: string
    namespace?: string
    port?: number
    ksvc?: {
      predeployed?: boolean
    }
    trafficControl?: {
      enabled?: boolean
      weightV1?: number
      weightV2?: number
    }
    ingress:
      | ({
          type?: 'cluster'
        } | null)
      | (
          | ({
              ingressClassName?: string
              tlsPass?: boolean
              useDefaultHost?: boolean
              subdomain: string
              domain: string
              useCname?: boolean
              cname?: {
                domain?: string
                tlsSecretName?: string
              }
              paths?: string[]
              forwardPath?: boolean
              hasCert?: boolean
              certSelect?: boolean
              certName?: string
              certArn?: string
              headers?: {
                response?: {
                  set?: {
                    name: string
                    value: string
                  }[]
                }
              }
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
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }[]
    }
  }
}
export type EditProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the build */
  projectId: string
  /** Project object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    build?: {
      id?: string
      teamId?: string
      name: string
      tag?: string
      mode?:
        | {
            docker: {
              repoUrl: string
              path?: string
              revision?: string
            }
            type: 'docker'
          }
        | {
            buildpacks: {
              repoUrl: string
              path?: string
              revision?: string
            }
            type: 'buildpacks'
          }
      externalRepo?: boolean
      secretSelect?: boolean
      secretName?: string
      trigger?: boolean
    }
    workload?: {
      id?: string
      teamId?: string
      name: string
      icon?: string
      url: string
      chartProvider?: 'helm' | 'git'
      path?: string
      chart?: string
      revision?: string
      chartMetadata?: {
        helmChartVersion?: string
        helmChartDescription?: string
      }
      namespace?: string
      imageUpdateStrategy?:
        | {
            type?: 'disabled'
          }
        | {
            digest?: {
              imageRepository: string
              tag: string
              imageParameter?: string
              tagParameter?: string
            }
            type?: 'digest'
          }
        | {
            semver?: {
              imageRepository: string
              versionConstraint: string
              imageParameter?: string
              tagParameter?: string
            }
            type?: 'semver'
          }
    }
    workloadValues?: {
      id?: string
      teamId?: string
      name?: string
      values: object
    }
    service?: {
      id?: string
      teamId?: string
      name: string
      namespace?: string
      port?: number
      ksvc?: {
        predeployed?: boolean
      }
      trafficControl?: {
        enabled?: boolean
        weightV1?: number
        weightV2?: number
      }
      ingress:
        | ({
            type?: 'cluster'
          } | null)
        | (
            | ({
                ingressClassName?: string
                tlsPass?: boolean
                useDefaultHost?: boolean
                subdomain: string
                domain: string
                useCname?: boolean
                cname?: {
                  domain?: string
                  tlsSecretName?: string
                }
                paths?: string[]
                forwardPath?: boolean
                hasCert?: boolean
                certSelect?: boolean
                certName?: string
                certArn?: string
                headers?: {
                  response?: {
                    set?: {
                      name: string
                      value: string
                    }[]
                  }
                }
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
          domain: string
          ports?: {
            number: number
            protocol: 'HTTPS' | 'HTTP' | 'TCP'
          }[]
        }[]
      }
    }
  }
}
export type GetAllWorkloadsApiResponse = /** status 200 Successfully obtained all workloads configuration */ {
  id?: string
  teamId?: string
  name: string
  icon?: string
  url: string
  chartProvider?: 'helm' | 'git'
  path?: string
  chart?: string
  revision?: string
  chartMetadata?: {
    helmChartVersion?: string
    helmChartDescription?: string
  }
  namespace?: string
  imageUpdateStrategy?:
    | {
        type?: 'disabled'
      }
    | {
        digest?: {
          imageRepository: string
          tag: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'digest'
      }
    | {
        semver?: {
          imageRepository: string
          versionConstraint: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'semver'
      }
}[]
export type GetAllWorkloadsApiArg = void
export type WorkloadCatalogApiResponse = /** status 200 Successfully updated a team project */ object
export type WorkloadCatalogApiArg = {
  /** Project object that contains updated values */
  body: object
}
export type GetTeamWorkloadsApiResponse = /** status 200 Successfully obtained team workloads configuration */ {
  id?: string
  teamId?: string
  name: string
  icon?: string
  url: string
  chartProvider?: 'helm' | 'git'
  path?: string
  chart?: string
  revision?: string
  chartMetadata?: {
    helmChartVersion?: string
    helmChartDescription?: string
  }
  namespace?: string
  imageUpdateStrategy?:
    | {
        type?: 'disabled'
      }
    | {
        digest?: {
          imageRepository: string
          tag: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'digest'
      }
    | {
        semver?: {
          imageRepository: string
          versionConstraint: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'semver'
      }
}[]
export type GetTeamWorkloadsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateWorkloadApiResponse = /** status 200 Successfully stored workload configuration */ {
  id?: string
  teamId?: string
  name: string
  icon?: string
  url: string
  chartProvider?: 'helm' | 'git'
  path?: string
  chart?: string
  revision?: string
  chartMetadata?: {
    helmChartVersion?: string
    helmChartDescription?: string
  }
  namespace?: string
  imageUpdateStrategy?:
    | {
        type?: 'disabled'
      }
    | {
        digest?: {
          imageRepository: string
          tag: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'digest'
      }
    | {
        semver?: {
          imageRepository: string
          versionConstraint: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'semver'
      }
}
export type CreateWorkloadApiArg = {
  /** ID of team to return */
  teamId: string
  /** Workload object */
  body: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
}
export type DeleteWorkloadApiResponse = /** status 200 Successfully deleted a workload */ undefined
export type DeleteWorkloadApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the workload */
  workloadId: string
}
export type GetWorkloadApiResponse = /** status 200 Successfully obtained workload configuration */ {
  id?: string
  teamId?: string
  name: string
  icon?: string
  url: string
  chartProvider?: 'helm' | 'git'
  path?: string
  chart?: string
  revision?: string
  chartMetadata?: {
    helmChartVersion?: string
    helmChartDescription?: string
  }
  namespace?: string
  imageUpdateStrategy?:
    | {
        type?: 'disabled'
      }
    | {
        digest?: {
          imageRepository: string
          tag: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'digest'
      }
    | {
        semver?: {
          imageRepository: string
          versionConstraint: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'semver'
      }
}
export type GetWorkloadApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the workload */
  workloadId: string
}
export type EditWorkloadApiResponse = /** status 200 Successfully edited a team secret */ {
  id?: string
  teamId?: string
  name: string
  icon?: string
  url: string
  chartProvider?: 'helm' | 'git'
  path?: string
  chart?: string
  revision?: string
  chartMetadata?: {
    helmChartVersion?: string
    helmChartDescription?: string
  }
  namespace?: string
  imageUpdateStrategy?:
    | {
        type?: 'disabled'
      }
    | {
        digest?: {
          imageRepository: string
          tag: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'digest'
      }
    | {
        semver?: {
          imageRepository: string
          versionConstraint: string
          imageParameter?: string
          tagParameter?: string
        }
        type?: 'semver'
      }
}
export type EditWorkloadApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the workload */
  workloadId: string
  /** Workload object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    icon?: string
    url: string
    chartProvider?: 'helm' | 'git'
    path?: string
    chart?: string
    revision?: string
    chartMetadata?: {
      helmChartVersion?: string
      helmChartDescription?: string
    }
    namespace?: string
    imageUpdateStrategy?:
      | {
          type?: 'disabled'
        }
      | {
          digest?: {
            imageRepository: string
            tag: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'digest'
        }
      | {
          semver?: {
            imageRepository: string
            versionConstraint: string
            imageParameter?: string
            tagParameter?: string
          }
          type?: 'semver'
        }
  }
}
export type GetWorkloadValuesApiResponse = /** status 200 Successfully obtained all workload values */ {
  id?: string
  teamId?: string
  name?: string
  values: object
}
export type GetWorkloadValuesApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the workload */
  workloadId: string
}
export type EditWorkloadValuesApiResponse = /** status 200 Successfully edited workload values */ {
  id?: string
  teamId?: string
  name?: string
  values: object
}
export type EditWorkloadValuesApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the workload */
  workloadId: string
  /** Workload values */
  body: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
}
export type UpdateWorkloadValuesApiResponse = /** status 200 Successfully updated workload values */ {
  id?: string
  teamId?: string
  name?: string
  values: object
}
export type UpdateWorkloadValuesApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the workload */
  workloadId: string
  /** Workload values */
  body: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
}
export type DeployApiResponse = /** status 202 Deploy has been triggered */ undefined
export type DeployApiArg = void
export type RevertApiResponse = unknown
export type RevertApiArg = void
export type RestoreApiResponse = unknown
export type RestoreApiArg = void
export type DownloadKubecfgApiResponse = /** status 200 Succesfully finished the download */ Blob
export type DownloadKubecfgApiArg = {
  /** ID of team to return */
  teamId: string
}
export type DownloadDockerConfigApiResponse = /** status 200 Succesfully finished the download */ Blob
export type DownloadDockerConfigApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetSessionApiResponse = /** status 200 Get the session for the logged in user */ {
  ca?: string
  core?: object
  corrupt?: boolean
  editor?: string
  inactivityTimeout?: number
  license?: {
    isValid: boolean
    hasLicense: boolean
    jwt?: string
    body?: {
      version: number
      key: string
      envType?: 'dev' | 'prod' | 'local'
      type: 'community' | 'professional' | 'enterprise'
      capabilities: {
        teams: number
        services: number
        workloads: number
      }
    }
  }
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
    sub?: string
  }
  versions?: {
    core?: string
    api?: string
    console?: string
    values?: string
  }
}
export type GetSessionApiArg = void
export type ApiDocsApiResponse = /** status 200 The requested apiDoc. */ object
export type ApiDocsApiArg = void
export type GetSettingsApiResponse = /** status 200 The request is successful. */ {
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
    opsgenie?: {
      apiKey?: string
      url?: string
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
      critical?: string
      nonCritical?: string
    }
  }
  cluster?: {
    name?: string
    domainSuffix?: string
    provider?: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'scaleway' | 'civo' | 'custom'
    apiName?: string
    apiServer?: string
    owner?: string
    region?: string
    k8sContext?: string
  }
  platformBackups?: {
    database?: {
      harbor?: {
        enabled?: boolean
        retentionPolicy?: string
        schedule?: string
      }
    }
    persistentVolumes?: {
      gitea?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
      drone?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
      keycloak?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
      harbor?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
      vault?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
      argo?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
      minio?: {
        enabled?: boolean
        ttl?: string
        schedule?: string
      }
    }
  }
  home?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
    drone?: ('slack' | 'msteams' | 'opsgenie')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
    opsgenie?: {
      apiKey?: string
      url?: string
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
      critical?: string
      nonCritical?: string
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
          civo: {
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
      entrypoint?: string
    }
    classes?: ({
      className?: string
    } & {
      network?: 'public' | 'private'
      loadBalancerIP?: string
      loadBalancerRG?: string
      loadBalancerSubnet?: string
      sourceIpAddressFiltering?: string
      entrypoint?: string
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
      provider: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'scaleway' | 'civo' | 'custom'
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
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
      }
      opsgenie?: {
        apiKey?: string
        url?: string
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
        critical?: string
        nonCritical?: string
      }
    }
    cluster?: {
      name?: string
      domainSuffix?: string
      provider?: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'scaleway' | 'civo' | 'custom'
      apiName?: string
      apiServer?: string
      owner?: string
      region?: string
      k8sContext?: string
    }
    platformBackups?: {
      database?: {
        harbor?: {
          enabled?: boolean
          retentionPolicy?: string
          schedule?: string
        }
      }
      persistentVolumes?: {
        gitea?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
        drone?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
        keycloak?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
        harbor?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
        vault?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
        argo?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
        minio?: {
          enabled?: boolean
          ttl?: string
          schedule?: string
        }
      }
    }
    home?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
      drone?: ('slack' | 'msteams' | 'opsgenie')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
      }
      opsgenie?: {
        apiKey?: string
        url?: string
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
        critical?: string
        nonCritical?: string
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
            civo: {
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
        entrypoint?: string
      }
      classes?: ({
        className?: string
      } & {
        network?: 'public' | 'private'
        loadBalancerIP?: string
        loadBalancerRG?: string
        loadBalancerSubnet?: string
        sourceIpAddressFiltering?: string
        entrypoint?: string
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
        provider: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'scaleway' | 'civo' | 'custom'
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
  id: string
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
  id: string
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
    id: string
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
  useDeleteLicenseMutation,
  useActivateLicenseMutation,
  useGetMetricsQuery,
  useGetAllSecretsQuery,
  useGetAllServicesQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetTeamQuery,
  useEditTeamMutation,
  useDeleteTeamMutation,
  useGetTeamServicesQuery,
  useCreateServiceMutation,
  useGetTeamK8SServicesQuery,
  useGetServiceQuery,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useGetSecretsQuery,
  useCreateSecretMutation,
  useGetSecretQuery,
  useEditSecretMutation,
  useDeleteSecretMutation,
  useGetAllBackupsQuery,
  useGetTeamBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useGetBackupQuery,
  useEditBackupMutation,
  useGetAllBuildsQuery,
  useGetTeamBuildsQuery,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useGetBuildQuery,
  useEditBuildMutation,
  useGetK8SVersionQuery,
  useConnectCloudttyMutation,
  useDeleteCloudttyMutation,
  useGetAllProjectsQuery,
  useGetTeamProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectQuery,
  useEditProjectMutation,
  useGetAllWorkloadsQuery,
  useWorkloadCatalogMutation,
  useGetTeamWorkloadsQuery,
  useCreateWorkloadMutation,
  useDeleteWorkloadMutation,
  useGetWorkloadQuery,
  useEditWorkloadMutation,
  useGetWorkloadValuesQuery,
  useEditWorkloadValuesMutation,
  useUpdateWorkloadValuesMutation,
  useDeployQuery,
  useRevertQuery,
  useRestoreQuery,
  useDownloadKubecfgQuery,
  useDownloadDockerConfigQuery,
  useGetSessionQuery,
  useApiDocsQuery,
  useGetSettingsQuery,
  useEditSettingsMutation,
  useGetAppsQuery,
  useToggleAppsMutation,
  useGetAppQuery,
  useEditAppMutation,
} = injectedRtkApi
