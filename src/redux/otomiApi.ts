import { emptySplitApi as api } from './emptyApi'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getValues: build.query<GetValuesApiResponse, GetValuesApiArg>({
      query: (queryArg) => ({
        url: `/otomi/values`,
        params: {
          filesOnly: queryArg.filesOnly,
          excludeSecrets: queryArg.excludeSecrets,
          withWorkloadValues: queryArg.withWorkloadValues,
        },
      }),
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
    migrateSecrets: build.mutation<MigrateSecretsApiResponse, MigrateSecretsApiArg>({
      query: () => ({ url: `/migrateSecrets`, method: 'POST' }),
    }),
    getAllSealedSecrets: build.query<GetAllSealedSecretsApiResponse, GetAllSealedSecretsApiArg>({
      query: () => ({ url: `/sealedsecrets` }),
    }),
    downloadSealedSecretKeys: build.query<DownloadSealedSecretKeysApiResponse, DownloadSealedSecretKeysApiArg>({
      query: () => ({ url: `/sealedsecretskeys` }),
    }),
    getSecretsFromK8S: build.query<GetSecretsFromK8SApiResponse, GetSecretsFromK8SApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/k8sSecrets` }),
    }),
    getSealedSecrets: build.query<GetSealedSecretsApiResponse, GetSealedSecretsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/sealedsecrets` }),
    }),
    createSealedSecret: build.mutation<CreateSealedSecretApiResponse, CreateSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/sealedsecrets`, method: 'POST', body: queryArg.body }),
    }),
    getSealedSecret: build.query<GetSealedSecretApiResponse, GetSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/sealedsecrets/${queryArg.secretId}` }),
    }),
    editSealedSecret: build.mutation<EditSealedSecretApiResponse, EditSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/sealedsecrets/${queryArg.secretId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteSealedSecret: build.mutation<DeleteSealedSecretApiResponse, DeleteSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/sealedsecrets/${queryArg.secretId}`, method: 'DELETE' }),
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
    getAllNetpols: build.query<GetAllNetpolsApiResponse, GetAllNetpolsApiArg>({
      query: () => ({ url: `/netpols` }),
    }),
    getTeamNetpols: build.query<GetTeamNetpolsApiResponse, GetTeamNetpolsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/netpols` }),
    }),
    createNetpol: build.mutation<CreateNetpolApiResponse, CreateNetpolApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/netpols`, method: 'POST', body: queryArg.body }),
    }),
    getNetpol: build.query<GetNetpolApiResponse, GetNetpolApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/netpols/${queryArg.netpolId}` }),
    }),
    editNetpol: build.mutation<EditNetpolApiResponse, EditNetpolApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/netpols/${queryArg.netpolId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteNetpol: build.mutation<DeleteNetpolApiResponse, DeleteNetpolApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/netpols/${queryArg.netpolId}`, method: 'DELETE' }),
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
    getDashboard: build.query<GetDashboardApiResponse, GetDashboardApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/dashboard` }),
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
    getAllPolicies: build.query<GetAllPoliciesApiResponse, GetAllPoliciesApiArg>({
      query: () => ({ url: `/policies` }),
    }),
    getTeamPolicies: build.query<GetTeamPoliciesApiResponse, GetTeamPoliciesApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/policies` }),
    }),
    getPolicy: build.query<GetPolicyApiResponse, GetPolicyApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/policies/${queryArg.policyId}` }),
    }),
    editPolicy: build.mutation<EditPolicyApiResponse, EditPolicyApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/policies/${queryArg.policyId}`,
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
    getSettingsInfo: build.query<GetSettingsInfoApiResponse, GetSettingsInfoApiArg>({
      query: () => ({ url: `/settingsInfo` }),
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
export type GetValuesApiResponse = unknown
export type GetValuesApiArg = {
  /** IDs of settings to return */
  filesOnly?: 'true' | 'false'
  excludeSecrets?: 'true' | 'false'
  withWorkloadValues?: 'true' | 'false'
}
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
}[]
export type GetAllServicesApiArg = void
export type GetTeamsApiResponse = /** status 200 Successfully obtained teams collection */ {
  id?: string
  name: string
  oidc?: {
    groupMapping?: string
  }
  password?: string
  managedMonitoring?: {
    grafana?: boolean
    prometheus?: boolean
    alertmanager?: boolean
    private?: boolean
  }
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
  resourceQuota?: {
    name: string
    value: string
  }[]
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: 'ingress'[]
    policies?: 'edit policies'[]
    team?: ('oidc' | 'managedMonitoring' | 'alerts' | 'resourceQuota' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
    access?: ('shell' | 'downloadKubeConfig' | 'downloadDockerConfig' | 'downloadCertificateAuthority')[]
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
  managedMonitoring?: {
    grafana?: boolean
    prometheus?: boolean
    alertmanager?: boolean
    private?: boolean
  }
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
  resourceQuota?: {
    name: string
    value: string
  }[]
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: 'ingress'[]
    policies?: 'edit policies'[]
    team?: ('oidc' | 'managedMonitoring' | 'alerts' | 'resourceQuota' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
    access?: ('shell' | 'downloadKubeConfig' | 'downloadDockerConfig' | 'downloadCertificateAuthority')[]
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
    managedMonitoring?: {
      grafana?: boolean
      prometheus?: boolean
      alertmanager?: boolean
      private?: boolean
    }
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
    resourceQuota?: {
      name: string
      value: string
    }[]
    networkPolicy?: {
      ingressPrivate?: boolean
      egressPublic?: boolean
    }
    selfService?: {
      service?: 'ingress'[]
      policies?: 'edit policies'[]
      team?: ('oidc' | 'managedMonitoring' | 'alerts' | 'resourceQuota' | 'networkPolicy')[]
      apps?: ('argocd' | 'gitea')[]
      access?: ('shell' | 'downloadKubeConfig' | 'downloadDockerConfig' | 'downloadCertificateAuthority')[]
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
  managedMonitoring?: {
    grafana?: boolean
    prometheus?: boolean
    alertmanager?: boolean
    private?: boolean
  }
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
  resourceQuota?: {
    name: string
    value: string
  }[]
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: 'ingress'[]
    policies?: 'edit policies'[]
    team?: ('oidc' | 'managedMonitoring' | 'alerts' | 'resourceQuota' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
    access?: ('shell' | 'downloadKubeConfig' | 'downloadDockerConfig' | 'downloadCertificateAuthority')[]
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
  managedMonitoring?: {
    grafana?: boolean
    prometheus?: boolean
    alertmanager?: boolean
    private?: boolean
  }
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
  resourceQuota?: {
    name: string
    value: string
  }[]
  networkPolicy?: {
    ingressPrivate?: boolean
    egressPublic?: boolean
  }
  selfService?: {
    service?: 'ingress'[]
    policies?: 'edit policies'[]
    team?: ('oidc' | 'managedMonitoring' | 'alerts' | 'resourceQuota' | 'networkPolicy')[]
    apps?: ('argocd' | 'gitea')[]
    access?: ('shell' | 'downloadKubeConfig' | 'downloadDockerConfig' | 'downloadCertificateAuthority')[]
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
    managedMonitoring?: {
      grafana?: boolean
      prometheus?: boolean
      alertmanager?: boolean
      private?: boolean
    }
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
    resourceQuota?: {
      name: string
      value: string
    }[]
    networkPolicy?: {
      ingressPrivate?: boolean
      egressPublic?: boolean
    }
    selfService?: {
      service?: 'ingress'[]
      policies?: 'edit policies'[]
      team?: ('oidc' | 'managedMonitoring' | 'alerts' | 'resourceQuota' | 'networkPolicy')[]
      apps?: ('argocd' | 'gitea')[]
      access?: ('shell' | 'downloadKubeConfig' | 'downloadDockerConfig' | 'downloadCertificateAuthority')[]
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
  }
}
export type DeleteServiceApiResponse = /** status 200 Successfully deleted a service */ undefined
export type DeleteServiceApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the service */
  serviceId: string
}
export type MigrateSecretsApiResponse = /** status 200 Successfully migrated secrets to sealed secrets */ {
  status?: 'success' | 'info'
  message?: string
  total?: number
  migrated?: number
  remaining?: number
}
export type MigrateSecretsApiArg = void
export type GetAllSealedSecretsApiResponse = /** status 200 Successfully obtained all sealed secrets */ {
  id?: string
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/service-account-token'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    key: string
    value: string
  }[]
  metadata?: {
    annotations?: {
      key: string
      value: string
    }[]
    finalizers?: string[]
    labels?: {
      key: string
      value: string
    }[]
  }
}[]
export type GetAllSealedSecretsApiArg = void
export type DownloadSealedSecretKeysApiResponse = /** status 200 Successfully downloaded sealed secret keys */ Blob
export type DownloadSealedSecretKeysApiArg = void
export type GetSecretsFromK8SApiResponse = /** status 200 Successfully obtained secrets from k8s */ {
  name?: string
}[]
export type GetSecretsFromK8SApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetSealedSecretsApiResponse = /** status 200 Successfully obtained sealed secrets */ {
  id?: string
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/service-account-token'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    key: string
    value: string
  }[]
  metadata?: {
    annotations?: {
      key: string
      value: string
    }[]
    finalizers?: string[]
    labels?: {
      key: string
      value: string
    }[]
  }
}[]
export type GetSealedSecretsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateSealedSecretApiResponse = /** status 200 Successfully stored sealed secret configuration */ {
  id?: string
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/service-account-token'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    key: string
    value: string
  }[]
  metadata?: {
    annotations?: {
      key: string
      value: string
    }[]
    finalizers?: string[]
    labels?: {
      key: string
      value: string
    }[]
  }
}
export type CreateSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** SealedSecret object */
  body: {
    id?: string
    name: string
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/service-account-token'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData: {
      key: string
      value: string
    }[]
    metadata?: {
      annotations?: {
        key: string
        value: string
      }[]
      finalizers?: string[]
      labels?: {
        key: string
        value: string
      }[]
    }
  }
}
export type GetSealedSecretApiResponse = /** status 200 Successfully obtained sealed secret configuration */ {
  id?: string
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/service-account-token'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    key: string
    value: string
  }[]
  metadata?: {
    annotations?: {
      key: string
      value: string
    }[]
    finalizers?: string[]
    labels?: {
      key: string
      value: string
    }[]
  }
}
export type GetSealedSecretApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the secret */
  secretId: string
}
export type EditSealedSecretApiResponse = /** status 200 Successfully edited a team sealed secret */ {
  id?: string
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/service-account-token'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    key: string
    value: string
  }[]
  metadata?: {
    annotations?: {
      key: string
      value: string
    }[]
    finalizers?: string[]
    labels?: {
      key: string
      value: string
    }[]
  }
}
export type EditSealedSecretApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the secret */
  secretId: string
  /** SealedSecret object that contains updated values */
  body: {
    id?: string
    name: string
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/service-account-token'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData: {
      key: string
      value: string
    }[]
    metadata?: {
      annotations?: {
        key: string
        value: string
      }[]
      finalizers?: string[]
      labels?: {
        key: string
        value: string
      }[]
    }
  }
}
export type DeleteSealedSecretApiResponse = /** status 200 Successfully deleted a team sealed secret */ undefined
export type DeleteSealedSecretApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the secret */
  secretId: string
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
export type GetAllNetpolsApiResponse = /** status 200 Successfully obtained all network policy configuration */ {
  id?: string
  teamId?: string
  name: string
  ruleType?: {
    type?: 'ingress' | 'egress'
    ingress?: {
      toLabelName?: string
      toLabelValue?: string
      mode: 'AllowAll' | 'AllowOnly'
      allow?: {
        fromNamespace: string
        fromLabelName?: string
        fromLabelValue?: string
      }[]
    }
    egress?: {
      domain: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }
  }
}[]
export type GetAllNetpolsApiArg = void
export type GetTeamNetpolsApiResponse = /** status 200 Successfully obtained team network policy configuration */ {
  id?: string
  teamId?: string
  name: string
  ruleType?: {
    type?: 'ingress' | 'egress'
    ingress?: {
      toLabelName?: string
      toLabelValue?: string
      mode: 'AllowAll' | 'AllowOnly'
      allow?: {
        fromNamespace: string
        fromLabelName?: string
        fromLabelValue?: string
      }[]
    }
    egress?: {
      domain: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }
  }
}[]
export type GetTeamNetpolsApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateNetpolApiResponse = /** status 200 Successfully stored network policy configuration */ {
  id?: string
  teamId?: string
  name: string
  ruleType?: {
    type?: 'ingress' | 'egress'
    ingress?: {
      toLabelName?: string
      toLabelValue?: string
      mode: 'AllowAll' | 'AllowOnly'
      allow?: {
        fromNamespace: string
        fromLabelName?: string
        fromLabelValue?: string
      }[]
    }
    egress?: {
      domain: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }
  }
}
export type CreateNetpolApiArg = {
  /** ID of team to return */
  teamId: string
  /** Network policy object */
  body: {
    id?: string
    teamId?: string
    name: string
    ruleType?: {
      type?: 'ingress' | 'egress'
      ingress?: {
        toLabelName?: string
        toLabelValue?: string
        mode: 'AllowAll' | 'AllowOnly'
        allow?: {
          fromNamespace: string
          fromLabelName?: string
          fromLabelValue?: string
        }[]
      }
      egress?: {
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }
    }
  }
}
export type GetNetpolApiResponse = /** status 200 Successfully obtained network policy configuration */ {
  id?: string
  teamId?: string
  name: string
  ruleType?: {
    type?: 'ingress' | 'egress'
    ingress?: {
      toLabelName?: string
      toLabelValue?: string
      mode: 'AllowAll' | 'AllowOnly'
      allow?: {
        fromNamespace: string
        fromLabelName?: string
        fromLabelValue?: string
      }[]
    }
    egress?: {
      domain: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }
  }
}
export type GetNetpolApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the network policy */
  netpolId: string
}
export type EditNetpolApiResponse = /** status 200 Successfully edited a team network policy */ {
  id?: string
  teamId?: string
  name: string
  ruleType?: {
    type?: 'ingress' | 'egress'
    ingress?: {
      toLabelName?: string
      toLabelValue?: string
      mode: 'AllowAll' | 'AllowOnly'
      allow?: {
        fromNamespace: string
        fromLabelName?: string
        fromLabelValue?: string
      }[]
    }
    egress?: {
      domain: string
      ports?: {
        number: number
        protocol: 'HTTPS' | 'HTTP' | 'TCP'
      }[]
    }
  }
}
export type EditNetpolApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the network policy */
  netpolId: string
  /** Netwok policy object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    ruleType?: {
      type?: 'ingress' | 'egress'
      ingress?: {
        toLabelName?: string
        toLabelValue?: string
        mode: 'AllowAll' | 'AllowOnly'
        allow?: {
          fromNamespace: string
          fromLabelName?: string
          fromLabelValue?: string
        }[]
      }
      egress?: {
        domain: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }
    }
  }
}
export type DeleteNetpolApiResponse = /** status 200 Successfully deleted a team network policy */ undefined
export type DeleteNetpolApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the network policy */
  netpolId: string
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
export type GetDashboardApiResponse = /** status 200 Successfully obtained dashboard inventory data */ object
export type GetDashboardApiArg = {
  /** ID of team to return */
  teamId: string
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
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretName?: string
  trigger?: boolean
  scanSource?: boolean
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
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretName?: string
  trigger?: boolean
  scanSource?: boolean
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
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretName?: string
  trigger?: boolean
  scanSource?: boolean
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
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
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretName?: string
  trigger?: boolean
  scanSource?: boolean
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
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'docker'
      }
    | {
        buildpacks: {
          repoUrl: string
          path?: string
          revision?: string
          envVars?: {
            name: string
            value: string
          }[]
        }
        type: 'buildpacks'
      }
  externalRepo?: boolean
  secretName?: string
  trigger?: boolean
  scanSource?: boolean
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
  }
}
export type GetAllPoliciesApiResponse = /** status 200 Successfully obtained all policy configuration */ {
  'allowed-repo'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'allowed-image-repositories'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
  'disallow-capabilities'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
  'disallow-capabilities-strict'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-namespaces'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-path'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-ports'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-process'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-latest-tag'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-privilege-escalation'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-privileged-containers'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-proc-mount'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-selinux'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-limits'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-liveness-probe'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-non-root-groups'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-readiness-probe'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-requests'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-run-as-non-root-user'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-run-as-nonroot'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-startup-probe'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-labels'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
  'restrict-apparmor-profiles'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-seccomp'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-seccomp-strict'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-sysctls'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-volume-types'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
}
export type GetAllPoliciesApiArg = void
export type GetTeamPoliciesApiResponse = /** status 200 Successfully obtained team policy configuration */ {
  'allowed-repo'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'allowed-image-repositories'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
  'disallow-capabilities'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
  'disallow-capabilities-strict'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-namespaces'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-path'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-ports'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-host-process'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-latest-tag'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-privilege-escalation'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-privileged-containers'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-proc-mount'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'disallow-selinux'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-limits'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-liveness-probe'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-non-root-groups'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-readiness-probe'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-requests'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-run-as-non-root-user'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-run-as-nonroot'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'require-startup-probe'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'required-otomi-label'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-apparmor-profiles'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-seccomp'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-seccomp-strict'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-sysctls'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
  }
  'restrict-volume-types'?: {
    action?: 'Audit' | 'Enforce'
    severity?: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
}
export type GetTeamPoliciesApiArg = {
  /** ID of team to return */
  teamId: string
}
export type GetPolicyApiResponse = /** status 200 Successfully obtained policy configuration */ {
  action: 'Audit' | 'Enforce'
  severity: 'low' | 'medium' | 'high'
  customValues?: string[]
}
export type GetPolicyApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the policy */
  policyId: string
}
export type EditPolicyApiResponse = /** status 200 Successfully edited a team policy */ {
  action: 'Audit' | 'Enforce'
  severity: 'low' | 'medium' | 'high'
  customValues?: string[]
}
export type EditPolicyApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the policy */
  policyId: string
  /** Policy object that contains updated values */
  body: {
    action: 'Audit' | 'Enforce'
    severity: 'low' | 'medium' | 'high'
    customValues?: string[]
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
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
              envVars?: {
                name: string
                value: string
              }[]
            }
            type: 'docker'
          }
        | {
            buildpacks: {
              repoUrl: string
              path?: string
              revision?: string
              envVars?: {
                name: string
                value: string
              }[]
            }
            type: 'buildpacks'
          }
      externalRepo?: boolean
      secretName?: string
      trigger?: boolean
      scanSource?: boolean
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
    }
  }
}
export type DeleteProjectApiResponse = /** status 200 Successfully deleted a project */ undefined
export type DeleteProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the project */
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
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
  }
}
export type GetProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the project */
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
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'docker'
        }
      | {
          buildpacks: {
            repoUrl: string
            path?: string
            revision?: string
            envVars?: {
              name: string
              value: string
            }[]
          }
          type: 'buildpacks'
        }
    externalRepo?: boolean
    secretName?: string
    trigger?: boolean
    scanSource?: boolean
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
  }
}
export type EditProjectApiArg = {
  /** ID of team to return */
  teamId: string
  /** ID of the project */
  projectId: string
  /** Project object that contains updated values */
  body: object
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
export type EditWorkloadApiResponse = /** status 200 Successfully edited a team workload */ {
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
export type GetSettingsInfoApiResponse = /** status 200 The request is successful. */ {
  cluster?: {
    name?: string
    domainSuffix?: string
    provider?: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'scaleway' | 'civo' | 'linode' | 'custom'
  }
  dns?: {
    zones?: string[]
  }
  otomi?: {
    additionalClusters?: {
      domainSuffix: string
      name: string
      provider:
        | 'aws'
        | 'azure'
        | 'digitalocean'
        | 'google'
        | 'ovh'
        | 'vultr'
        | 'scaleway'
        | 'civo'
        | 'linode'
        | 'custom'
    }[]
    hasExternalDNS?: boolean
    hasExternalIDP?: boolean
  }
  ingressClassNames?: string[]
}
export type GetSettingsInfoApiArg = void
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
    provider?: 'aws' | 'azure' | 'digitalocean' | 'google' | 'ovh' | 'vultr' | 'scaleway' | 'civo' | 'linode' | 'custom'
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
          linode: {
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
      provider:
        | 'aws'
        | 'azure'
        | 'digitalocean'
        | 'google'
        | 'ovh'
        | 'vultr'
        | 'scaleway'
        | 'civo'
        | 'linode'
        | 'custom'
    }[]
    globalPullSecret?: {
      username?: string
      password?: string
      email?: string
      server?: string
    } | null
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
      provider?:
        | 'aws'
        | 'azure'
        | 'digitalocean'
        | 'google'
        | 'ovh'
        | 'vultr'
        | 'scaleway'
        | 'civo'
        | 'linode'
        | 'custom'
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
            linode: {
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
        provider:
          | 'aws'
          | 'azure'
          | 'digitalocean'
          | 'google'
          | 'ovh'
          | 'vultr'
          | 'scaleway'
          | 'civo'
          | 'linode'
          | 'custom'
      }[]
      globalPullSecret?: {
        username?: string
        password?: string
        email?: string
        server?: string
      } | null
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
  useGetValuesQuery,
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
  useMigrateSecretsMutation,
  useGetAllSealedSecretsQuery,
  useDownloadSealedSecretKeysQuery,
  useGetSecretsFromK8SQuery,
  useGetSealedSecretsQuery,
  useCreateSealedSecretMutation,
  useGetSealedSecretQuery,
  useEditSealedSecretMutation,
  useDeleteSealedSecretMutation,
  useGetSecretsQuery,
  useCreateSecretMutation,
  useGetSecretQuery,
  useEditSecretMutation,
  useDeleteSecretMutation,
  useGetAllNetpolsQuery,
  useGetTeamNetpolsQuery,
  useCreateNetpolMutation,
  useGetNetpolQuery,
  useEditNetpolMutation,
  useDeleteNetpolMutation,
  useGetAllBackupsQuery,
  useGetTeamBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useGetBackupQuery,
  useEditBackupMutation,
  useGetDashboardQuery,
  useGetAllBuildsQuery,
  useGetTeamBuildsQuery,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useGetBuildQuery,
  useEditBuildMutation,
  useGetAllPoliciesQuery,
  useGetTeamPoliciesQuery,
  useGetPolicyQuery,
  useEditPolicyMutation,
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
  useGetSettingsInfoQuery,
  useGetSettingsQuery,
  useEditSettingsMutation,
  useGetAppsQuery,
  useToggleAppsMutation,
  useGetAppQuery,
  useEditAppMutation,
} = injectedRtkApi
