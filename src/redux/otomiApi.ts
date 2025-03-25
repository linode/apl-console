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
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services/${queryArg.serviceName}` }),
    }),
    editService: build.mutation<EditServiceApiResponse, EditServiceApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/services/${queryArg.serviceName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteService: build.mutation<DeleteServiceApiResponse, DeleteServiceApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/services/${queryArg.serviceName}`, method: 'DELETE' }),
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
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}` }),
    }),
    editSealedSecret: build.mutation<EditSealedSecretApiResponse, EditSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteSealedSecret: build.mutation<DeleteSealedSecretApiResponse, DeleteSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}`,
        method: 'DELETE',
      }),
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
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}` }),
    }),
    editNetpol: build.mutation<EditNetpolApiResponse, EditNetpolApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteNetpol: build.mutation<DeleteNetpolApiResponse, DeleteNetpolApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}`, method: 'DELETE' }),
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
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/backups/${queryArg.backupName}`, method: 'DELETE' }),
    }),
    getBackup: build.query<GetBackupApiResponse, GetBackupApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/backups/${queryArg.backupName}` }),
    }),
    editBackup: build.mutation<EditBackupApiResponse, EditBackupApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/backups/${queryArg.backupName}`,
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
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/builds/${queryArg.buildName}`, method: 'DELETE' }),
    }),
    getBuild: build.query<GetBuildApiResponse, GetBuildApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/builds/${queryArg.buildName}` }),
    }),
    editBuild: build.mutation<EditBuildApiResponse, EditBuildApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/builds/${queryArg.buildName}`,
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
    getAllUsers: build.query<GetAllUsersApiResponse, GetAllUsersApiArg>({
      query: () => ({ url: `/users` }),
    }),
    createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
      query: (queryArg) => ({ url: `/users`, method: 'POST', body: queryArg.body }),
    }),
    getUser: build.query<GetUserApiResponse, GetUserApiArg>({
      query: (queryArg) => ({ url: `/users/${queryArg.userId}` }),
    }),
    editUser: build.mutation<EditUserApiResponse, EditUserApiArg>({
      query: (queryArg) => ({ url: `/users/${queryArg.userId}`, method: 'PUT', body: queryArg.body }),
    }),
    deleteUser: build.mutation<DeleteUserApiResponse, DeleteUserApiArg>({
      query: (queryArg) => ({ url: `/users/${queryArg.userId}`, method: 'DELETE' }),
    }),
    editTeamUsers: build.mutation<EditTeamUsersApiResponse, EditTeamUsersApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/users`, method: 'PUT', body: queryArg.body }),
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
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/projects/${queryArg.projectName}`, method: 'DELETE' }),
    }),
    getProject: build.query<GetProjectApiResponse, GetProjectApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/projects/${queryArg.projectName}` }),
    }),
    editProject: build.mutation<EditProjectApiResponse, EditProjectApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/projects/${queryArg.projectName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllCodeRepos: build.query<GetAllCodeReposApiResponse, GetAllCodeReposApiArg>({
      query: () => ({ url: `/coderepos` }),
    }),
    getTeamCodeRepos: build.query<GetTeamCodeReposApiResponse, GetTeamCodeReposApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/coderepos` }),
    }),
    createCodeRepo: build.mutation<CreateCodeRepoApiResponse, CreateCodeRepoApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/coderepos`, method: 'POST', body: queryArg.body }),
    }),
    getCodeRepo: build.query<GetCodeRepoApiResponse, GetCodeRepoApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}` }),
    }),
    editCodeRepo: build.mutation<EditCodeRepoApiResponse, EditCodeRepoApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteCodeRepo: build.mutation<DeleteCodeRepoApiResponse, DeleteCodeRepoApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}`,
        method: 'DELETE',
      }),
    }),
    getAllWorkloads: build.query<GetAllWorkloadsApiResponse, GetAllWorkloadsApiArg>({
      query: () => ({ url: `/workloads` }),
    }),
    workloadCatalog: build.mutation<WorkloadCatalogApiResponse, WorkloadCatalogApiArg>({
      query: (queryArg) => ({ url: `/workloadCatalog`, method: 'POST', body: queryArg.body }),
    }),
    getHelmChartContent: build.query<GetHelmChartContentApiResponse, GetHelmChartContentApiArg>({
      query: (queryArg) => ({ url: `/helmChartContent`, params: { url: queryArg.url } }),
    }),
    createWorkloadCatalog: build.mutation<CreateWorkloadCatalogApiResponse, CreateWorkloadCatalogApiArg>({
      query: (queryArg) => ({ url: `/createWorkloadCatalog`, method: 'POST', body: queryArg.body }),
    }),
    getTeamWorkloads: build.query<GetTeamWorkloadsApiResponse, GetTeamWorkloadsApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads` }),
    }),
    createWorkload: build.mutation<CreateWorkloadApiResponse, CreateWorkloadApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads`, method: 'POST', body: queryArg.body }),
    }),
    deleteWorkload: build.mutation<DeleteWorkloadApiResponse, DeleteWorkloadApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}`, method: 'DELETE' }),
    }),
    getWorkload: build.query<GetWorkloadApiResponse, GetWorkloadApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}` }),
    }),
    editWorkload: build.mutation<EditWorkloadApiResponse, EditWorkloadApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getWorkloadValues: build.query<GetWorkloadValuesApiResponse, GetWorkloadValuesApiArg>({
      query: (queryArg) => ({ url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}/values` }),
    }),
    editWorkloadValues: build.mutation<EditWorkloadValuesApiResponse, EditWorkloadValuesApiArg>({
      query: (queryArg) => ({
        url: `/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}/values`,
        method: 'PUT',
        body: queryArg.body,
      }),
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
    getRepoBranches: build.query<GetRepoBranchesApiResponse, GetRepoBranchesApiArg>({
      query: (queryArg) => ({
        url: `/repoBranches`,
        params: { url: queryArg.url, teamId: queryArg.teamId, secret: queryArg.secret },
      }),
    }),
    getTestRepoConnect: build.query<GetTestRepoConnectApiResponse, GetTestRepoConnectApiArg>({
      query: (queryArg) => ({
        url: `/testRepoConnect`,
        params: { url: queryArg.url, teamId: queryArg.teamId, secret: queryArg.secret },
      }),
    }),
    getInternalRepoUrls: build.query<GetInternalRepoUrlsApiResponse, GetInternalRepoUrlsApiArg>({
      query: (queryArg) => ({ url: `/internalRepoUrls`, params: { teamId: queryArg.teamId } }),
    }),
    createObjWizard: build.mutation<CreateObjWizardApiResponse, CreateObjWizardApiArg>({
      query: (queryArg) => ({ url: `/objwizard`, method: 'POST', body: queryArg.body }),
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
    alertmanager?: boolean
  }
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
    alertmanager?: boolean
  }
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
      alertmanager?: boolean
    }
    alerts?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
    alertmanager?: boolean
  }
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
    alertmanager?: boolean
  }
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
      alertmanager?: boolean
    }
    alerts?: {
      repeatInterval?: string
      groupInterval?: string
      receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
  /** Name of the service */
  serviceName: string
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
  /** Name of the service */
  serviceName: string
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
  /** Name of the service */
  serviceName: string
}
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
  /** Name of the sealed secret */
  sealedSecretName: string
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
  /** Name of the sealed secret */
  sealedSecretName: string
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
  /** Name of the sealed secret */
  sealedSecretName: string
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
  /** Name of the network policy */
  netpolName: string
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
  /** Name of the network policy */
  netpolName: string
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
  /** Name of the network policy */
  netpolName: string
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
  /** Name of the backup */
  backupName: string
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
  /** Name of the backup */
  backupName: string
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
  /** Name of the backup */
  backupName: string
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
  imageName?: string
  codeRepoName?: string
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
  imageName?: string
  codeRepoName?: string
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
  imageName?: string
  codeRepoName?: string
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
    imageName?: string
    codeRepoName?: string
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
  /** Name of the build */
  buildName: string
}
export type GetBuildApiResponse = /** status 200 Successfully obtained build configuration */ {
  id?: string
  teamId?: string
  name: string
  imageName?: string
  codeRepoName?: string
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
  /** Name of the build */
  buildName: string
}
export type EditBuildApiResponse = /** status 200 Successfully edited a team build */ {
  id?: string
  teamId?: string
  name: string
  imageName?: string
  codeRepoName?: string
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
  /** Name of the build */
  buildName: string
  /** Build object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    imageName?: string
    codeRepoName?: string
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
  'disallow-capabilities-strict'?: {
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
  'disallow-capabilities-strict'?: {
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
export type GetAllUsersApiResponse = /** status 200 Successfully obtained all users configuration */ {
  id?: string
  email: string
  firstName: string
  lastName: string
  isPlatformAdmin?: boolean
  isTeamAdmin?: boolean
  teams?: string[]
  initialPassword?: string
}[]
export type GetAllUsersApiArg = void
export type CreateUserApiResponse = /** status 200 Successfully stored user configuration */ {
  id?: string
  email: string
  firstName: string
  lastName: string
  isPlatformAdmin?: boolean
  isTeamAdmin?: boolean
  teams?: string[]
  initialPassword?: string
}
export type CreateUserApiArg = {
  /** User object */
  body: {
    id?: string
    email: string
    firstName: string
    lastName: string
    isPlatformAdmin?: boolean
    isTeamAdmin?: boolean
    teams?: string[]
    initialPassword?: string
  }
}
export type GetUserApiResponse = /** status 200 Successfully obtained user configuration */ {
  id?: string
  email: string
  firstName: string
  lastName: string
  isPlatformAdmin?: boolean
  isTeamAdmin?: boolean
  teams?: string[]
  initialPassword?: string
}
export type GetUserApiArg = {
  /** ID of the user */
  userId: string
}
export type EditUserApiResponse = /** status 200 Successfully edited a team user */ {
  id?: string
  email: string
  firstName: string
  lastName: string
  isPlatformAdmin?: boolean
  isTeamAdmin?: boolean
  teams?: string[]
  initialPassword?: string
}
export type EditUserApiArg = {
  /** ID of the user */
  userId: string
  /** User object that contains updated values */
  body: {
    id?: string
    email: string
    firstName: string
    lastName: string
    isPlatformAdmin?: boolean
    isTeamAdmin?: boolean
    teams?: string[]
    initialPassword?: string
  }
}
export type DeleteUserApiResponse = /** status 200 Successfully deleted a user */ undefined
export type DeleteUserApiArg = {
  /** ID of the user */
  userId: string
}
export type EditTeamUsersApiResponse = /** status 200 Successfully edited a team user */ {
  id?: string
  email: string
  firstName: string
  lastName: string
  isPlatformAdmin?: boolean
  isTeamAdmin?: boolean
  teams?: string[]
  initialPassword?: string
}[]
export type EditTeamUsersApiArg = {
  /** ID of team to return */
  teamId: string
  /** User object that contains updated values */
  body: {
    id?: string
    email?: string
    isPlatformAdmin?: boolean
    isTeamAdmin?: boolean
    teams?: string[]
  }[]
}
export type GetAllProjectsApiResponse = /** status 200 Successfully obtained all projects configuration */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    imageName?: string
    codeRepoName?: string
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
    imageName?: string
    codeRepoName?: string
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
    imageName?: string
    codeRepoName?: string
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
      imageName?: string
      codeRepoName?: string
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
      createNamespace?: boolean
      sidecarInject?: boolean
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
  /** Name of the project */
  projectName: string
}
export type GetProjectApiResponse = /** status 200 Successfully obtained project configuration */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    imageName?: string
    codeRepoName?: string
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
  /** Name of the project */
  projectName: string
}
export type EditProjectApiResponse = /** status 200 Successfully edited a team project */ {
  id?: string
  teamId?: string
  name: string
  build?: {
    id?: string
    teamId?: string
    name: string
    imageName?: string
    codeRepoName?: string
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
  /** Name of the project */
  projectName: string
  /** Project object that contains updated values */
  body: object
}
export type GetAllCodeReposApiResponse = /** status 200 Successfully obtained all code repositories */ {
  id?: string
  teamId?: string
  name: string
  gitService: 'gitea' | 'github' | 'gitlab'
  repositoryUrl: string
  private?: boolean
  secret?: string
}[]
export type GetAllCodeReposApiArg = void
export type GetTeamCodeReposApiResponse = /** status 200 Successfully obtained code repositories */ {
  id?: string
  teamId?: string
  name: string
  gitService: 'gitea' | 'github' | 'gitlab'
  repositoryUrl: string
  private?: boolean
  secret?: string
}[]
export type GetTeamCodeReposApiArg = {
  /** ID of team to return */
  teamId: string
}
export type CreateCodeRepoApiResponse = /** status 200 Successfully stored code repo configuration */ {
  id?: string
  teamId?: string
  name: string
  gitService: 'gitea' | 'github' | 'gitlab'
  repositoryUrl: string
  private?: boolean
  secret?: string
}
export type CreateCodeRepoApiArg = {
  /** ID of team */
  teamId: string
  /** CodeRepo object */
  body: {
    id?: string
    teamId?: string
    name: string
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
}
export type GetCodeRepoApiResponse = /** status 200 Successfully obtained code repo configuration */ {
  id?: string
  teamId?: string
  name: string
  gitService: 'gitea' | 'github' | 'gitlab'
  repositoryUrl: string
  private?: boolean
  secret?: string
}
export type GetCodeRepoApiArg = {
  /** ID of team to return */
  teamId: string
  /** Name of the code repository */
  codeRepositoryName: string
}
export type EditCodeRepoApiResponse = /** status 200 Successfully edited a team code repo */ {
  id?: string
  teamId?: string
  name: string
  gitService: 'gitea' | 'github' | 'gitlab'
  repositoryUrl: string
  private?: boolean
  secret?: string
}
export type EditCodeRepoApiArg = {
  /** ID of team to return */
  teamId: string
  /** Name of the code repository */
  codeRepositoryName: string
  /** CodeRepo object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
}
export type DeleteCodeRepoApiResponse = /** status 200 Successfully deleted a team code repo */ undefined
export type DeleteCodeRepoApiArg = {
  /** ID of team to return */
  teamId: string
  /** Name of the code repository */
  codeRepositoryName: string
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
  createNamespace?: boolean
  sidecarInject?: boolean
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
export type GetHelmChartContentApiResponse = /** status 200 Successfully obtained helm chart content */ {
  values?: object
  error?: string
}
export type GetHelmChartContentApiArg = {
  /** URL of the helm chart */
  url?: string
}
export type CreateWorkloadCatalogApiResponse = /** status 200 Successfully updated a team project */ object
export type CreateWorkloadCatalogApiArg = {
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
  createNamespace?: boolean
  sidecarInject?: boolean
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
  createNamespace?: boolean
  sidecarInject?: boolean
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
  /** Name of the workload */
  workloadName: string
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
  createNamespace?: boolean
  sidecarInject?: boolean
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
  /** Name of the workload */
  workloadName: string
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
  createNamespace?: boolean
  sidecarInject?: boolean
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
  /** Name of the workload */
  workloadName: string
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
    createNamespace?: boolean
    sidecarInject?: boolean
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
  /** Name of the workload */
  workloadName: string
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
  /** Name of the workload */
  workloadName: string
  /** Workload values */
  body: {
    id?: string
    teamId?: string
    name?: string
    values: object
  }
}
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
    isPlatformAdmin: boolean
    isTeamAdmin: boolean
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
  defaultPlatformAdminEmail?: string
  objectStorage?: {
    showWizard?: boolean
    objStorageApps?: {
      appId?: string
      required?: boolean
    }[]
    objStorageRegions?: {
      id?: string
      label?: string
    }[]
  }
  versions?: {
    core?: string
    api?: string
    console?: string
    values?: string
  }
  valuesSchema?: object
}
export type GetSessionApiArg = void
export type ApiDocsApiResponse = /** status 200 The requested apiDoc. */ object
export type ApiDocsApiArg = void
export type GetSettingsInfoApiResponse = /** status 200 The request is successful. */ {
  cluster?: {
    name?: string
    domainSuffix?: string
    provider?: 'linode' | 'custom'
  }
  dns?: {
    zones?: string[]
  }
  otomi?: {
    hasExternalDNS?: boolean
    isPreInstalled?: boolean
    hasExternalIDP?: boolean
  }
  smtp?: {
    smarthost?: string
  }
  ingressClassNames?: string[]
}
export type GetSettingsInfoApiArg = void
export type GetRepoBranchesApiResponse = /** status 200 The request is successful. */ string[]
export type GetRepoBranchesApiArg = {
  /** URL of the repository */
  url?: string
  /** Id of the team */
  teamId?: string
  /** Name of the secret for private repositories */
  secret?: string
}
export type GetTestRepoConnectApiResponse = /** status 200 The request is successful. */ {
  url?: string
  status?: 'unknown' | 'success' | 'failed'
}
export type GetTestRepoConnectApiArg = {
  /** URL of the repository */
  url?: string
  /** Id of the team */
  teamId?: string
  /** Name of the secret for private repositories */
  secret?: string
}
export type GetInternalRepoUrlsApiResponse = /** status 200 Successfully obtained internal repo urls */ string[]
export type GetInternalRepoUrlsApiArg = {
  /** ID of the team */
  teamId?: string
}
export type CreateObjWizardApiResponse = /** status 200 Successfully configured obj wizard configuration */ object
export type CreateObjWizardApiArg = {
  /** ObjWizard object */
  body: {
    showWizard?: boolean
    apiToken?: string
    regionId?: string
    errorMessage?: string
    status?: string
    objBuckets?: string[]
  }
}
export type GetSettingsApiResponse = /** status 200 The request is successful. */ {
  alerts?: {
    repeatInterval?: string
    groupInterval?: string
    receivers?: ('slack' | 'msteams' | 'opsgenie' | 'email' | 'none')[]
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
    apiServer?: string
    k8sContext?: string
    provider?: 'linode' | 'custom'
  }
  platformBackups?: {
    gitea?: {
      enabled?: boolean
      retentionPolicy?: string
      schedule?: string
    }
    database?: {
      harbor?: {
        enabled?: boolean
        retentionPolicy?: string
        schedule?: string
      }
      gitea?: {
        enabled?: boolean
        retentionPolicy?: string
        schedule?: string
      }
      keycloak?: {
        enabled?: boolean
        retentionPolicy?: string
        schedule?: string
      }
    }
    persistentVolumes?: {
      linodeApiToken?: string
    }
  }
  obj?: {
    showWizard?: boolean
    provider?:
      | {
          type?: 'disabled'
        }
      | {
          type?: 'minioLocal'
        }
      | {
          linode: {
            region: string
            accessKeyId: string
            secretAccessKey: string
            buckets?: {
              loki?: string
              cnpg?: string
              velero?: string
              harbor?: string
              tempo?: string
              gitea?: string
              thanos?: string
            }
          }
          type: 'linode'
        }
  }
  dns?: {
    zones?: string[]
    domainFilters?: string[]
    zoneIdFilters?: string[]
    provider?:
      | (object | null)
      | {
          akamai?: {
            host: string
            accessToken: string
            clientToken: string
            clientSecret: string
          }
        }
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
      loadBalancerIP?: string
      entrypoint?: string
      annotations?: {
        key?: string
        value?: string
      }[]
    }
    classes?: ({
      className?: string
    } & {
      loadBalancerIP?: string
      entrypoint?: string
      annotations?: {
        key?: string
        value?: string
      }[]
    })[]
  }
  kms?: {
    sops?:
      | (object | null)
      | {
          provider?: 'age'
          age: {
            publicKey: string
            privateKey: string
          }
        }
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
    platformAdminGroupID?: string
    allTeamsAdminGroupID?: string
    teamAdminGroupID?: string
    usernameClaimMapper?: string
    subClaimMapper?: string
  }
  otomi?: {
    adminPassword?: string
    isPreInstalled?: boolean
    globalPullSecret?: {
      username?: string
      password?: string
      email?: string
      server?: string
    } | null
    hasExternalDNS?: boolean
    hasExternalIDP?: boolean
    isMultitenant?: boolean
    nodeSelector?: {
      name?: string
      value?: string
    }[]
    version: string
  }
  versions?: {
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
      apiServer?: string
      k8sContext?: string
      provider?: 'linode' | 'custom'
    }
    platformBackups?: {
      gitea?: {
        enabled?: boolean
        retentionPolicy?: string
        schedule?: string
      }
      database?: {
        harbor?: {
          enabled?: boolean
          retentionPolicy?: string
          schedule?: string
        }
        gitea?: {
          enabled?: boolean
          retentionPolicy?: string
          schedule?: string
        }
        keycloak?: {
          enabled?: boolean
          retentionPolicy?: string
          schedule?: string
        }
      }
      persistentVolumes?: {
        linodeApiToken?: string
      }
    }
    obj?: {
      showWizard?: boolean
      provider?:
        | {
            type?: 'disabled'
          }
        | {
            type?: 'minioLocal'
          }
        | {
            linode: {
              region: string
              accessKeyId: string
              secretAccessKey: string
              buckets?: {
                loki?: string
                cnpg?: string
                velero?: string
                harbor?: string
                tempo?: string
                gitea?: string
                thanos?: string
              }
            }
            type: 'linode'
          }
    }
    dns?: {
      zones?: string[]
      domainFilters?: string[]
      zoneIdFilters?: string[]
      provider?:
        | (object | null)
        | {
            akamai?: {
              host: string
              accessToken: string
              clientToken: string
              clientSecret: string
            }
          }
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
        loadBalancerIP?: string
        entrypoint?: string
        annotations?: {
          key?: string
          value?: string
        }[]
      }
      classes?: ({
        className?: string
      } & {
        loadBalancerIP?: string
        entrypoint?: string
        annotations?: {
          key?: string
          value?: string
        }[]
      })[]
    }
    kms?: {
      sops?:
        | (object | null)
        | {
            provider?: 'age'
            age: {
              publicKey: string
              privateKey: string
            }
          }
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
      platformAdminGroupID?: string
      allTeamsAdminGroupID?: string
      teamAdminGroupID?: string
      usernameClaimMapper?: string
      subClaimMapper?: string
    }
    otomi?: {
      adminPassword?: string
      isPreInstalled?: boolean
      globalPullSecret?: {
        username?: string
        password?: string
        email?: string
        server?: string
      } | null
      hasExternalDNS?: boolean
      hasExternalIDP?: boolean
      isMultitenant?: boolean
      nodeSelector?: {
        name?: string
        value?: string
      }[]
      version: string
    }
    versions?: {
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
    values?: object
  }
}
export const {
  useGetValuesQuery,
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
  useGetAllSealedSecretsQuery,
  useDownloadSealedSecretKeysQuery,
  useGetSecretsFromK8SQuery,
  useGetSealedSecretsQuery,
  useCreateSealedSecretMutation,
  useGetSealedSecretQuery,
  useEditSealedSecretMutation,
  useDeleteSealedSecretMutation,
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
  useGetAllUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useEditTeamUsersMutation,
  useGetAllProjectsQuery,
  useGetTeamProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectQuery,
  useEditProjectMutation,
  useGetAllCodeReposQuery,
  useGetTeamCodeReposQuery,
  useCreateCodeRepoMutation,
  useGetCodeRepoQuery,
  useEditCodeRepoMutation,
  useDeleteCodeRepoMutation,
  useGetAllWorkloadsQuery,
  useWorkloadCatalogMutation,
  useGetHelmChartContentQuery,
  useCreateWorkloadCatalogMutation,
  useGetTeamWorkloadsQuery,
  useCreateWorkloadMutation,
  useDeleteWorkloadMutation,
  useGetWorkloadQuery,
  useEditWorkloadMutation,
  useGetWorkloadValuesQuery,
  useEditWorkloadValuesMutation,
  useDownloadKubecfgQuery,
  useDownloadDockerConfigQuery,
  useGetSessionQuery,
  useApiDocsQuery,
  useGetSettingsInfoQuery,
  useGetRepoBranchesQuery,
  useGetTestRepoConnectQuery,
  useGetInternalRepoUrlsQuery,
  useCreateObjWizardMutation,
  useGetSettingsQuery,
  useEditSettingsMutation,
  useGetAppsQuery,
  useToggleAppsMutation,
  useGetAppQuery,
  useEditAppMutation,
} = injectedRtkApi
