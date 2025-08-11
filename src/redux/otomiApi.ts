import { emptySplitApi as api } from './emptyApi'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getValues: build.query<GetValuesApiResponse, GetValuesApiArg>({
      query: (queryArg) => ({
        url: `/v1/otomi/values`,
        params: {
          filesOnly: queryArg.filesOnly,
          excludeSecrets: queryArg.excludeSecrets,
          withWorkloadValues: queryArg.withWorkloadValues,
        },
      }),
    }),
    getTeams: build.query<GetTeamsApiResponse, GetTeamsApiArg>({
      query: () => ({ url: `/v1/teams` }),
    }),
    createTeam: build.mutation<CreateTeamApiResponse, CreateTeamApiArg>({
      query: (queryArg) => ({ url: `/v1/teams`, method: 'POST', body: queryArg.body }),
    }),
    getTeam: build.query<GetTeamApiResponse, GetTeamApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}` }),
    }),
    editTeam: build.mutation<EditTeamApiResponse, EditTeamApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}`, method: 'PUT', body: queryArg.body }),
    }),
    deleteTeam: build.mutation<DeleteTeamApiResponse, DeleteTeamApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}`, method: 'DELETE' }),
    }),
    getAplTeams: build.query<GetAplTeamsApiResponse, GetAplTeamsApiArg>({
      query: () => ({ url: `/v2/teams` }),
    }),
    createAplTeam: build.mutation<CreateAplTeamApiResponse, CreateAplTeamApiArg>({
      query: (queryArg) => ({ url: `/v2/teams`, method: 'POST', body: queryArg.body }),
    }),
    getAplTeam: build.query<GetAplTeamApiResponse, GetAplTeamApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}` }),
    }),
    editAplTeam: build.mutation<EditAplTeamApiResponse, EditAplTeamApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}`, method: 'PUT', body: queryArg.body }),
    }),
    deleteAplTeam: build.mutation<DeleteAplTeamApiResponse, DeleteAplTeamApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}`, method: 'DELETE' }),
    }),
    getAllServices: build.query<GetAllServicesApiResponse, GetAllServicesApiArg>({
      query: () => ({ url: `/v1/services` }),
    }),
    getTeamServices: build.query<GetTeamServicesApiResponse, GetTeamServicesApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/services` }),
    }),
    createService: build.mutation<CreateServiceApiResponse, CreateServiceApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/services`, method: 'POST', body: queryArg.body }),
    }),
    getTeamK8SServices: build.query<GetTeamK8SServicesApiResponse, GetTeamK8SServicesApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/kubernetes/services` }),
    }),
    getK8SWorkloadPodLabels: build.query<GetK8SWorkloadPodLabelsApiResponse, GetK8SWorkloadPodLabelsApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/kubernetes/networkpolicies`,
        params: { workloadName: queryArg.workloadName, namespace: queryArg['namespace'] },
      }),
    }),
    listUniquePodNamesByLabel: build.query<ListUniquePodNamesByLabelApiResponse, ListUniquePodNamesByLabelApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/kubernetes/fetchPodsFromLabel`,
        params: { labelSelector: queryArg.labelSelector, namespace: queryArg['namespace'] },
      }),
    }),
    getService: build.query<GetServiceApiResponse, GetServiceApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/services/${queryArg.serviceName}` }),
    }),
    editService: build.mutation<EditServiceApiResponse, EditServiceApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/services/${queryArg.serviceName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteService: build.mutation<DeleteServiceApiResponse, DeleteServiceApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/services/${queryArg.serviceName}`, method: 'DELETE' }),
    }),
    getAllAplServices: build.query<GetAllAplServicesApiResponse, GetAllAplServicesApiArg>({
      query: () => ({ url: `/v2/services` }),
    }),
    getTeamAplServices: build.query<GetTeamAplServicesApiResponse, GetTeamAplServicesApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/services` }),
    }),
    createAplService: build.mutation<CreateAplServiceApiResponse, CreateAplServiceApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/services`, method: 'POST', body: queryArg.body }),
    }),
    getAplService: build.query<GetAplServiceApiResponse, GetAplServiceApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/services/${queryArg.serviceName}` }),
    }),
    editAplService: build.mutation<EditAplServiceApiResponse, EditAplServiceApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/services/${queryArg.serviceName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteAplService: build.mutation<DeleteAplServiceApiResponse, DeleteAplServiceApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/services/${queryArg.serviceName}`, method: 'DELETE' }),
    }),
    getAllSealedSecrets: build.query<GetAllSealedSecretsApiResponse, GetAllSealedSecretsApiArg>({
      query: () => ({ url: `/v1/sealedsecrets` }),
    }),
    downloadSealedSecretKeys: build.query<DownloadSealedSecretKeysApiResponse, DownloadSealedSecretKeysApiArg>({
      query: () => ({ url: `/v1/sealedsecretskeys` }),
    }),
    getSecretsFromK8S: build.query<GetSecretsFromK8SApiResponse, GetSecretsFromK8SApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/k8sSecrets` }),
    }),
    getSealedSecrets: build.query<GetSealedSecretsApiResponse, GetSealedSecretsApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/sealedsecrets` }),
    }),
    createSealedSecret: build.mutation<CreateSealedSecretApiResponse, CreateSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/sealedsecrets`, method: 'POST', body: queryArg.body }),
    }),
    getSealedSecret: build.query<GetSealedSecretApiResponse, GetSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}` }),
    }),
    editSealedSecret: build.mutation<EditSealedSecretApiResponse, EditSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteSealedSecret: build.mutation<DeleteSealedSecretApiResponse, DeleteSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}`,
        method: 'DELETE',
      }),
    }),
    getAllAplSecrets: build.query<GetAllAplSecretsApiResponse, GetAllAplSecretsApiArg>({
      query: () => ({ url: `/v2/sealedsecrets` }),
    }),
    getAplSealedSecrets: build.query<GetAplSealedSecretsApiResponse, GetAplSealedSecretsApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/sealedsecrets` }),
    }),
    createAplSealedSecret: build.mutation<CreateAplSealedSecretApiResponse, CreateAplSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/sealedsecrets`, method: 'POST', body: queryArg.body }),
    }),
    getAplSealedSecret: build.query<GetAplSealedSecretApiResponse, GetAplSealedSecretApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}` }),
    }),
    editAplSealedSecret: build.mutation<EditAplSealedSecretApiResponse, EditAplSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteAplSealedSecret: build.mutation<DeleteAplSealedSecretApiResponse, DeleteAplSealedSecretApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/sealedsecrets/${queryArg.sealedSecretName}`,
        method: 'DELETE',
      }),
    }),
    getAllNetpols: build.query<GetAllNetpolsApiResponse, GetAllNetpolsApiArg>({
      query: () => ({ url: `/v1/netpols` }),
    }),
    getTeamNetpols: build.query<GetTeamNetpolsApiResponse, GetTeamNetpolsApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/netpols` }),
    }),
    createNetpol: build.mutation<CreateNetpolApiResponse, CreateNetpolApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/netpols`, method: 'POST', body: queryArg.body }),
    }),
    getNetpol: build.query<GetNetpolApiResponse, GetNetpolApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}` }),
    }),
    editNetpol: build.mutation<EditNetpolApiResponse, EditNetpolApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteNetpol: build.mutation<DeleteNetpolApiResponse, DeleteNetpolApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}`, method: 'DELETE' }),
    }),
    getAllAplNetpols: build.query<GetAllAplNetpolsApiResponse, GetAllAplNetpolsApiArg>({
      query: () => ({ url: `/v2/netpols` }),
    }),
    getTeamAplNetpols: build.query<GetTeamAplNetpolsApiResponse, GetTeamAplNetpolsApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/netpols` }),
    }),
    createAplNetpol: build.mutation<CreateAplNetpolApiResponse, CreateAplNetpolApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/netpols`, method: 'POST', body: queryArg.body }),
    }),
    getAplNetpol: build.query<GetAplNetpolApiResponse, GetAplNetpolApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}` }),
    }),
    editAplNetpol: build.mutation<EditAplNetpolApiResponse, EditAplNetpolApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteAplNetpol: build.mutation<DeleteAplNetpolApiResponse, DeleteAplNetpolApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/netpols/${queryArg.netpolName}`, method: 'DELETE' }),
    }),
    getAllBackups: build.query<GetAllBackupsApiResponse, GetAllBackupsApiArg>({
      query: () => ({ url: `/v1/backups` }),
    }),
    getTeamBackups: build.query<GetTeamBackupsApiResponse, GetTeamBackupsApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/backups` }),
    }),
    createBackup: build.mutation<CreateBackupApiResponse, CreateBackupApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/backups`, method: 'POST', body: queryArg.body }),
    }),
    deleteBackup: build.mutation<DeleteBackupApiResponse, DeleteBackupApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/backups/${queryArg.backupName}`, method: 'DELETE' }),
    }),
    getBackup: build.query<GetBackupApiResponse, GetBackupApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/backups/${queryArg.backupName}` }),
    }),
    editBackup: build.mutation<EditBackupApiResponse, EditBackupApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/backups/${queryArg.backupName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllAplBackups: build.query<GetAllAplBackupsApiResponse, GetAllAplBackupsApiArg>({
      query: () => ({ url: `/v2/backups` }),
    }),
    getTeamAplBackups: build.query<GetTeamAplBackupsApiResponse, GetTeamAplBackupsApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/backups` }),
    }),
    createAplBackup: build.mutation<CreateAplBackupApiResponse, CreateAplBackupApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/backups`, method: 'POST', body: queryArg.body }),
    }),
    deleteAplBackup: build.mutation<DeleteAplBackupApiResponse, DeleteAplBackupApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/backups/${queryArg.backupName}`, method: 'DELETE' }),
    }),
    getAplBackup: build.query<GetAplBackupApiResponse, GetAplBackupApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/backups/${queryArg.backupName}` }),
    }),
    editAplBackup: build.mutation<EditAplBackupApiResponse, EditAplBackupApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/backups/${queryArg.backupName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getDashboard: build.query<GetDashboardApiResponse, GetDashboardApiArg>({
      query: (queryArg) => ({ url: `/v1/dashboard`, params: { teamName: queryArg.teamName } }),
    }),
    getAllBuilds: build.query<GetAllBuildsApiResponse, GetAllBuildsApiArg>({
      query: () => ({ url: `/v1/builds` }),
    }),
    getTeamBuilds: build.query<GetTeamBuildsApiResponse, GetTeamBuildsApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/builds` }),
    }),
    createBuild: build.mutation<CreateBuildApiResponse, CreateBuildApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/builds`, method: 'POST', body: queryArg.body }),
    }),
    deleteBuild: build.mutation<DeleteBuildApiResponse, DeleteBuildApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/builds/${queryArg.buildName}`, method: 'DELETE' }),
    }),
    getBuild: build.query<GetBuildApiResponse, GetBuildApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/builds/${queryArg.buildName}` }),
    }),
    editBuild: build.mutation<EditBuildApiResponse, EditBuildApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/builds/${queryArg.buildName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllAplBuilds: build.query<GetAllAplBuildsApiResponse, GetAllAplBuildsApiArg>({
      query: () => ({ url: `/v2/builds` }),
    }),
    getTeamAplBuilds: build.query<GetTeamAplBuildsApiResponse, GetTeamAplBuildsApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/builds` }),
    }),
    createAplBuild: build.mutation<CreateAplBuildApiResponse, CreateAplBuildApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/builds`, method: 'POST', body: queryArg.body }),
    }),
    deleteAplBuild: build.mutation<DeleteAplBuildApiResponse, DeleteAplBuildApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/builds/${queryArg.buildName}`, method: 'DELETE' }),
    }),
    getAplBuild: build.query<GetAplBuildApiResponse, GetAplBuildApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/builds/${queryArg.buildName}` }),
    }),
    editAplBuild: build.mutation<EditAplBuildApiResponse, EditAplBuildApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/builds/${queryArg.buildName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllPolicies: build.query<GetAllPoliciesApiResponse, GetAllPoliciesApiArg>({
      query: () => ({ url: `/v1/policies` }),
    }),
    getTeamPolicies: build.query<GetTeamPoliciesApiResponse, GetTeamPoliciesApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/policies` }),
    }),
    getPolicy: build.query<GetPolicyApiResponse, GetPolicyApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/policies/${queryArg.policyName}` }),
    }),
    editPolicy: build.mutation<EditPolicyApiResponse, EditPolicyApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/policies/${queryArg.policyName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllAplPolicies: build.query<GetAllAplPoliciesApiResponse, GetAllAplPoliciesApiArg>({
      query: () => ({ url: `/v2/policies` }),
    }),
    getTeamAplPolicies: build.query<GetTeamAplPoliciesApiResponse, GetTeamAplPoliciesApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/policies` }),
    }),
    getAplPolicy: build.query<GetAplPolicyApiResponse, GetAplPolicyApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/policies/${queryArg.policyName}` }),
    }),
    editAplPolicy: build.mutation<EditAplPolicyApiResponse, EditAplPolicyApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/policies/${queryArg.policyName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getK8SVersion: build.query<GetK8SVersionApiResponse, GetK8SVersionApiArg>({
      query: () => ({ url: `/v1/k8sVersion` }),
    }),
    connectAplCloudtty: build.query<ConnectAplCloudttyApiResponse, ConnectAplCloudttyApiArg>({
      query: (queryArg) => ({ url: `/v2/cloudtty`, params: { teamId: queryArg.teamId } }),
    }),
    deleteAplCloudtty: build.mutation<DeleteAplCloudttyApiResponse, DeleteAplCloudttyApiArg>({
      query: () => ({ url: `/v2/cloudtty`, method: 'DELETE' }),
    }),
    connectCloudtty: build.query<ConnectCloudttyApiResponse, ConnectCloudttyApiArg>({
      query: (queryArg) => ({ url: `/v1/cloudtty`, params: { teamId: queryArg.teamId } }),
    }),
    deleteCloudtty: build.mutation<DeleteCloudttyApiResponse, DeleteCloudttyApiArg>({
      query: () => ({ url: `/v1/cloudtty`, method: 'DELETE' }),
    }),
    getAllUsers: build.query<GetAllUsersApiResponse, GetAllUsersApiArg>({
      query: () => ({ url: `/v1/users` }),
    }),
    createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
      query: (queryArg) => ({ url: `/v1/users`, method: 'POST', body: queryArg.body }),
    }),
    getUser: build.query<GetUserApiResponse, GetUserApiArg>({
      query: (queryArg) => ({ url: `/v1/users/${queryArg.userId}` }),
    }),
    editUser: build.mutation<EditUserApiResponse, EditUserApiArg>({
      query: (queryArg) => ({ url: `/v1/users/${queryArg.userId}`, method: 'PUT', body: queryArg.body }),
    }),
    deleteUser: build.mutation<DeleteUserApiResponse, DeleteUserApiArg>({
      query: (queryArg) => ({ url: `/v1/users/${queryArg.userId}`, method: 'DELETE' }),
    }),
    editTeamUsers: build.mutation<EditTeamUsersApiResponse, EditTeamUsersApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/users`, method: 'PUT', body: queryArg.body }),
    }),
    getAllCodeRepos: build.query<GetAllCodeReposApiResponse, GetAllCodeReposApiArg>({
      query: () => ({ url: `/v1/coderepos` }),
    }),
    getTeamCodeRepos: build.query<GetTeamCodeReposApiResponse, GetTeamCodeReposApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/coderepos` }),
    }),
    createCodeRepo: build.mutation<CreateCodeRepoApiResponse, CreateCodeRepoApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/coderepos`, method: 'POST', body: queryArg.body }),
    }),
    getCodeRepo: build.query<GetCodeRepoApiResponse, GetCodeRepoApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}` }),
    }),
    editCodeRepo: build.mutation<EditCodeRepoApiResponse, EditCodeRepoApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteCodeRepo: build.mutation<DeleteCodeRepoApiResponse, DeleteCodeRepoApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}`,
        method: 'DELETE',
      }),
    }),
    getAllAplCodeRepos: build.query<GetAllAplCodeReposApiResponse, GetAllAplCodeReposApiArg>({
      query: () => ({ url: `/v2/coderepos` }),
    }),
    getTeamAplCodeRepos: build.query<GetTeamAplCodeReposApiResponse, GetTeamAplCodeReposApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/coderepos` }),
    }),
    createAplCodeRepo: build.mutation<CreateAplCodeRepoApiResponse, CreateAplCodeRepoApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/coderepos`, method: 'POST', body: queryArg.body }),
    }),
    getAplCodeRepo: build.query<GetAplCodeRepoApiResponse, GetAplCodeRepoApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}` }),
    }),
    editAplCodeRepo: build.mutation<EditAplCodeRepoApiResponse, EditAplCodeRepoApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    deleteAplCodeRepo: build.mutation<DeleteAplCodeRepoApiResponse, DeleteAplCodeRepoApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/coderepos/${queryArg.codeRepositoryName}`,
        method: 'DELETE',
      }),
    }),
    getAllWorkloads: build.query<GetAllWorkloadsApiResponse, GetAllWorkloadsApiArg>({
      query: () => ({ url: `/v1/workloads` }),
    }),
    workloadCatalog: build.mutation<WorkloadCatalogApiResponse, WorkloadCatalogApiArg>({
      query: (queryArg) => ({ url: `/v1/workloadCatalog`, method: 'POST', body: queryArg.body }),
    }),
    getHelmChartContent: build.query<GetHelmChartContentApiResponse, GetHelmChartContentApiArg>({
      query: (queryArg) => ({ url: `/v1/helmChartContent`, params: { url: queryArg.url } }),
    }),
    createWorkloadCatalog: build.mutation<CreateWorkloadCatalogApiResponse, CreateWorkloadCatalogApiArg>({
      query: (queryArg) => ({ url: `/v1/createWorkloadCatalog`, method: 'POST', body: queryArg.body }),
    }),
    getTeamWorkloads: build.query<GetTeamWorkloadsApiResponse, GetTeamWorkloadsApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/workloads` }),
    }),
    createWorkload: build.mutation<CreateWorkloadApiResponse, CreateWorkloadApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/workloads`, method: 'POST', body: queryArg.body }),
    }),
    deleteWorkload: build.mutation<DeleteWorkloadApiResponse, DeleteWorkloadApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}`,
        method: 'DELETE',
      }),
    }),
    getWorkload: build.query<GetWorkloadApiResponse, GetWorkloadApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}` }),
    }),
    editWorkload: build.mutation<EditWorkloadApiResponse, EditWorkloadApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getWorkloadValues: build.query<GetWorkloadValuesApiResponse, GetWorkloadValuesApiArg>({
      query: (queryArg) => ({ url: `/v1/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}/values` }),
    }),
    editWorkloadValues: build.mutation<EditWorkloadValuesApiResponse, EditWorkloadValuesApiArg>({
      query: (queryArg) => ({
        url: `/v1/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}/values`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    getAllAplWorkloads: build.query<GetAllAplWorkloadsApiResponse, GetAllAplWorkloadsApiArg>({
      query: () => ({ url: `/v2/workloads` }),
    }),
    getTeamAplWorkloads: build.query<GetTeamAplWorkloadsApiResponse, GetTeamAplWorkloadsApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/workloads` }),
    }),
    createAplWorkload: build.mutation<CreateAplWorkloadApiResponse, CreateAplWorkloadApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/workloads`, method: 'POST', body: queryArg.body }),
    }),
    deleteAplWorkload: build.mutation<DeleteAplWorkloadApiResponse, DeleteAplWorkloadApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}`,
        method: 'DELETE',
      }),
    }),
    getAplWorkload: build.query<GetAplWorkloadApiResponse, GetAplWorkloadApiArg>({
      query: (queryArg) => ({ url: `/v2/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}` }),
    }),
    editAplWorkload: build.mutation<EditAplWorkloadApiResponse, EditAplWorkloadApiArg>({
      query: (queryArg) => ({
        url: `/v2/teams/${queryArg.teamId}/workloads/${queryArg.workloadName}`,
        method: 'PUT',
        body: queryArg.body,
      }),
    }),
    downloadKubecfg: build.query<DownloadKubecfgApiResponse, DownloadKubecfgApiArg>({
      query: (queryArg) => ({ url: `/v1/kubecfg/${queryArg.teamId}` }),
    }),
    downloadDockerConfig: build.query<DownloadDockerConfigApiResponse, DownloadDockerConfigApiArg>({
      query: (queryArg) => ({ url: `/v1/dockerconfig/${queryArg.teamId}` }),
    }),
    getSession: build.query<GetSessionApiResponse, GetSessionApiArg>({
      query: () => ({ url: `/v1/session` }),
    }),
    v1ApiDocs: build.query<V1ApiDocsApiResponse, V1ApiDocsApiArg>({
      query: () => ({ url: `/v1/apiDocs` }),
    }),
    getSettingsInfo: build.query<GetSettingsInfoApiResponse, GetSettingsInfoApiArg>({
      query: () => ({ url: `/v1/settingsInfo` }),
    }),
    getRepoBranches: build.query<GetRepoBranchesApiResponse, GetRepoBranchesApiArg>({
      query: (queryArg) => ({
        url: `/v1/repoBranches`,
        params: { codeRepoName: queryArg.codeRepoName, teamId: queryArg.teamId },
      }),
    }),
    getTestRepoConnect: build.query<GetTestRepoConnectApiResponse, GetTestRepoConnectApiArg>({
      query: (queryArg) => ({
        url: `/v1/testRepoConnect`,
        params: { url: queryArg.url, teamId: queryArg.teamId, secret: queryArg.secret },
      }),
    }),
    getInternalRepoUrls: build.query<GetInternalRepoUrlsApiResponse, GetInternalRepoUrlsApiArg>({
      query: (queryArg) => ({ url: `/v1/internalRepoUrls`, params: { teamId: queryArg.teamId } }),
    }),
    createObjWizard: build.mutation<CreateObjWizardApiResponse, CreateObjWizardApiArg>({
      query: (queryArg) => ({ url: `/v1/objwizard`, method: 'POST', body: queryArg.body }),
    }),
    getSettings: build.query<GetSettingsApiResponse, GetSettingsApiArg>({
      query: (queryArg) => ({ url: `/v1/settings`, params: { ids: queryArg.ids } }),
    }),
    editSettings: build.mutation<EditSettingsApiResponse, EditSettingsApiArg>({
      query: (queryArg) => ({ url: `/v1/settings/${queryArg.settingId}`, method: 'PUT', body: queryArg.body }),
    }),
    getApps: build.query<GetAppsApiResponse, GetAppsApiArg>({
      query: (queryArg) => ({ url: `/v1/apps/${queryArg.teamId}`, params: { picks: queryArg.picks } }),
    }),
    toggleApps: build.mutation<ToggleAppsApiResponse, ToggleAppsApiArg>({
      query: (queryArg) => ({ url: `/v1/apps/${queryArg.teamId}`, method: 'PUT', body: queryArg.body }),
    }),
    getApp: build.query<GetAppApiResponse, GetAppApiArg>({
      query: (queryArg) => ({ url: `/v1/apps/${queryArg.teamId}/${queryArg.appId}` }),
    }),
    editApp: build.mutation<EditAppApiResponse, EditAppApiArg>({
      query: (queryArg) => ({
        url: `/v1/apps/${queryArg.teamId}/${queryArg.appId}`,
        method: 'PUT',
        body: queryArg.body,
      }),
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
    receivers?: ('slack' | 'msteams' | 'none')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
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
    teamMembers?: {
      createServices: boolean
      editSecurityPolicies: boolean
      useCloudShell: boolean
      downloadKubeconfig: boolean
      downloadDockerLogin: boolean
    }
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
    receivers?: ('slack' | 'msteams' | 'none')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
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
    teamMembers?: {
      createServices: boolean
      editSecurityPolicies: boolean
      useCloudShell: boolean
      downloadKubeconfig: boolean
      downloadDockerLogin: boolean
    }
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
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
      teamMembers?: {
        createServices: boolean
        editSecurityPolicies: boolean
        useCloudShell: boolean
        downloadKubeconfig: boolean
        downloadDockerLogin: boolean
      }
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
    receivers?: ('slack' | 'msteams' | 'none')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
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
    teamMembers?: {
      createServices: boolean
      editSecurityPolicies: boolean
      useCloudShell: boolean
      downloadKubeconfig: boolean
      downloadDockerLogin: boolean
    }
  }
}
export type GetTeamApiArg = {
  /** ID of team */
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
    receivers?: ('slack' | 'msteams' | 'none')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
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
    teamMembers?: {
      createServices: boolean
      editSecurityPolicies: boolean
      useCloudShell: boolean
      downloadKubeconfig: boolean
      downloadDockerLogin: boolean
    }
  }
}
export type EditTeamApiArg = {
  /** ID of team */
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
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
      teamMembers?: {
        createServices: boolean
        editSecurityPolicies: boolean
        useCloudShell: boolean
        downloadKubeconfig: boolean
        downloadDockerLogin: boolean
      }
    }
  }
}
export type DeleteTeamApiResponse = /** status 200 Successfully deleted a team */ undefined
export type DeleteTeamApiArg = {
  /** ID of team */
  teamId: string
}
export type GetAplTeamsApiResponse = /** status 200 Successfully obtained teams collection */ ({
  kind: 'AplTeamSettingSet'
  spec: {
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
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
      teamMembers?: {
        createServices: boolean
        editSecurityPolicies: boolean
        useCloudShell: boolean
        downloadKubeconfig: boolean
        downloadDockerLogin: boolean
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAplTeamsApiArg = void
export type CreateAplTeamApiResponse = /** status 200 Successfully obtained teams collection */ {
  kind: 'AplTeamSettingSet'
  spec: {
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
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
      teamMembers?: {
        createServices: boolean
        editSecurityPolicies: boolean
        useCloudShell: boolean
        downloadKubeconfig: boolean
        downloadDockerLogin: boolean
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplTeamApiArg = {
  /** Team object that needs to be added to the collection */
  body: {
    kind: 'AplTeamSettingSet'
    spec: {
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
        receivers?: ('slack' | 'msteams' | 'none')[]
        slack?: {
          channel?: string
          channelCrit?: string
          url?: string
        }
        msteams?: {
          highPrio?: string
          lowPrio?: string
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
        teamMembers?: {
          createServices: boolean
          editSecurityPolicies: boolean
          useCloudShell: boolean
          downloadKubeconfig: boolean
          downloadDockerLogin: boolean
        }
      }
    }
  } & {
    metadata: {
      name: string
      labels: {
        'apl.io/teamId': string
      }
    }
  }
}
export type GetAplTeamApiResponse = /** status 200 Successfully obtained team */ {
  kind: 'AplTeamSettingSet'
  spec: {
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
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
      teamMembers?: {
        createServices: boolean
        editSecurityPolicies: boolean
        useCloudShell: boolean
        downloadKubeconfig: boolean
        downloadDockerLogin: boolean
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplTeamApiArg = {
  /** ID of team */
  teamId: string
}
export type EditAplTeamApiResponse = /** status 200 Successfully edited team */ {
  kind: 'AplTeamSettingSet'
  spec: {
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
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
      teamMembers?: {
        createServices: boolean
        editSecurityPolicies: boolean
        useCloudShell: boolean
        downloadKubeconfig: boolean
        downloadDockerLogin: boolean
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplTeamApiArg = {
  /** ID of team */
  teamId: string
  /** Team object that contains updated values */
  body: {
    kind: 'AplTeamSettingSet'
    spec: {
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
        receivers?: ('slack' | 'msteams' | 'none')[]
        slack?: {
          channel?: string
          channelCrit?: string
          url?: string
        }
        msteams?: {
          highPrio?: string
          lowPrio?: string
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
        teamMembers?: {
          createServices: boolean
          editSecurityPolicies: boolean
          useCloudShell: boolean
          downloadKubeconfig: boolean
          downloadDockerLogin: boolean
        }
      }
    }
  } & {
    metadata: {
      name: string
      labels: {
        'apl.io/teamId': string
      }
    }
  }
}
export type DeleteAplTeamApiResponse = /** status 200 Successfully deleted a team */ undefined
export type DeleteAplTeamApiArg = {
  /** ID of team */
  teamId: string
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
  /** ID of team */
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
  /** ID of team */
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
export type GetTeamK8SServicesApiResponse = /** status 200 Successfully obtained kubernetes services */ {
  name: string
  ports?: number[]
  managedByKnative?: boolean
}[]
export type GetTeamK8SServicesApiArg = {
  /** ID of team */
  teamId: string
}
export type GetK8SWorkloadPodLabelsApiResponse = /** status 200 Successfully obtained Podlabels from given workload */ {
  [key: string]: string
}
export type GetK8SWorkloadPodLabelsApiArg = {
  /** ID of team */
  teamId: string
  /** name of the workload to get Podlabels from */
  workloadName?: string
  /** namespace of the workload to get Podlabels from */
  namespace?: string
}
export type ListUniquePodNamesByLabelApiResponse =
  /** status 200 Successfully obtained pods from given label */ string[]
export type ListUniquePodNamesByLabelApiArg = {
  /** ID of team */
  teamId: string
  /** name of the label to get pods name from */
  labelSelector?: string
  /** namespace of the workload to get Podlabels from */
  namespace?: string
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
  teamId: string
  /** Name of the service */
  serviceName: string
}
export type GetAllAplServicesApiResponse = /** status 200 Successfully obtained all services */ ({
  kind: 'AplTeamService'
  spec: {
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
    ingressClassName?: string
    tlsPass?: boolean
    ownHost?: boolean
    domain?: string
    useCname?: boolean
    cname?: {
      domain?: string
      tlsSecretName?: string
    }
    paths?: string[]
    forwardPath?: boolean
    hasCert?: boolean
    certName?: string
    headers?: {
      response?: {
        set?: {
          name: string
          value: string
        }[]
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplServicesApiArg = void
export type GetTeamAplServicesApiResponse = /** status 200 Successfully obtained services */ ({
  kind: 'AplTeamService'
  spec: {
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
    ingressClassName?: string
    tlsPass?: boolean
    ownHost?: boolean
    domain?: string
    useCname?: boolean
    cname?: {
      domain?: string
      tlsSecretName?: string
    }
    paths?: string[]
    forwardPath?: boolean
    hasCert?: boolean
    certName?: string
    headers?: {
      response?: {
        set?: {
          name: string
          value: string
        }[]
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplServicesApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplServiceApiResponse = /** status 200 Successfully stored service configuration */ {
  kind: 'AplTeamService'
  spec: {
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
    ingressClassName?: string
    tlsPass?: boolean
    ownHost?: boolean
    domain?: string
    useCname?: boolean
    cname?: {
      domain?: string
      tlsSecretName?: string
    }
    paths?: string[]
    forwardPath?: boolean
    hasCert?: boolean
    certName?: string
    headers?: {
      response?: {
        set?: {
          name: string
          value: string
        }[]
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplServiceApiArg = {
  /** ID of team */
  teamId: string
  /** Service object */
  body: {
    kind: 'AplTeamService'
    spec: {
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
      ingressClassName?: string
      tlsPass?: boolean
      ownHost?: boolean
      domain?: string
      useCname?: boolean
      cname?: {
        domain?: string
        tlsSecretName?: string
      }
      paths?: string[]
      forwardPath?: boolean
      hasCert?: boolean
      certName?: string
      headers?: {
        response?: {
          set?: {
            name: string
            value: string
          }[]
        }
      }
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type GetAplServiceApiResponse = /** status 200 Successfully obtained service configuration */ {
  kind: 'AplTeamService'
  spec: {
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
    ingressClassName?: string
    tlsPass?: boolean
    ownHost?: boolean
    domain?: string
    useCname?: boolean
    cname?: {
      domain?: string
      tlsSecretName?: string
    }
    paths?: string[]
    forwardPath?: boolean
    hasCert?: boolean
    certName?: string
    headers?: {
      response?: {
        set?: {
          name: string
          value: string
        }[]
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplServiceApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the service */
  serviceName: string
}
export type EditAplServiceApiResponse = /** status 200 Successfully edited service */ {
  kind: 'AplTeamService'
  spec: {
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
    ingressClassName?: string
    tlsPass?: boolean
    ownHost?: boolean
    domain?: string
    useCname?: boolean
    cname?: {
      domain?: string
      tlsSecretName?: string
    }
    paths?: string[]
    forwardPath?: boolean
    hasCert?: boolean
    certName?: string
    headers?: {
      response?: {
        set?: {
          name: string
          value: string
        }[]
      }
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplServiceApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the service */
  serviceName: string
  /** Service object that contains updated values */
  body: {
    kind: 'AplTeamService'
    spec: {
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
      ingressClassName?: string
      tlsPass?: boolean
      ownHost?: boolean
      domain?: string
      useCname?: boolean
      cname?: {
        domain?: string
        tlsSecretName?: string
      }
      paths?: string[]
      forwardPath?: boolean
      hasCert?: boolean
      certName?: string
      headers?: {
        response?: {
          set?: {
            name: string
            value: string
          }[]
        }
      }
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplServiceApiResponse = /** status 200 Successfully deleted a service */ undefined
export type DeleteAplServiceApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the service */
  serviceName: string
}
export type GetAllSealedSecretsApiResponse = /** status 200 Successfully obtained all sealed secrets */ {
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    additionalProperties?: string
  }
  metadata?: {
    annotations?: {
      additionalProperties?: string
    }
    finalizers?: string[]
    labels?: {
      additionalProperties?: string
    }
  }
}[]
export type GetAllSealedSecretsApiArg = void
export type DownloadSealedSecretKeysApiResponse = /** status 200 Successfully downloaded sealed secret keys */ Blob
export type DownloadSealedSecretKeysApiArg = void
export type GetSecretsFromK8SApiResponse = /** status 200 Successfully obtained secrets from k8s */ {
  name?: string
}[]
export type GetSecretsFromK8SApiArg = {
  /** ID of team */
  teamId: string
}
export type GetSealedSecretsApiResponse = /** status 200 Successfully obtained sealed secrets */ {
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    additionalProperties?: string
  }
  metadata?: {
    annotations?: {
      additionalProperties?: string
    }
    finalizers?: string[]
    labels?: {
      additionalProperties?: string
    }
  }
}[]
export type GetSealedSecretsApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateSealedSecretApiResponse = /** status 200 Successfully stored sealed secret configuration */ {
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    additionalProperties?: string
  }
  metadata?: {
    annotations?: {
      additionalProperties?: string
    }
    finalizers?: string[]
    labels?: {
      additionalProperties?: string
    }
  }
}
export type CreateSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** SealedSecret object */
  body: {
    name: string
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData: {
      additionalProperties?: string
    }
    metadata?: {
      annotations?: {
        additionalProperties?: string
      }
      finalizers?: string[]
      labels?: {
        additionalProperties?: string
      }
    }
  }
}
export type GetSealedSecretApiResponse = /** status 200 Successfully obtained sealed secret configuration */ {
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    additionalProperties?: string
  }
  metadata?: {
    annotations?: {
      additionalProperties?: string
    }
    finalizers?: string[]
    labels?: {
      additionalProperties?: string
    }
  }
}
export type GetSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the sealed secret */
  sealedSecretName: string
}
export type EditSealedSecretApiResponse = /** status 200 Successfully edited a team sealed secret */ {
  name: string
  namespace?: string
  immutable?: boolean
  type:
    | 'kubernetes.io/opaque'
    | 'kubernetes.io/dockercfg'
    | 'kubernetes.io/dockerconfigjson'
    | 'kubernetes.io/basic-auth'
    | 'kubernetes.io/ssh-auth'
    | 'kubernetes.io/tls'
  encryptedData: {
    additionalProperties?: string
  }
  metadata?: {
    annotations?: {
      additionalProperties?: string
    }
    finalizers?: string[]
    labels?: {
      additionalProperties?: string
    }
  }
}
export type EditSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the sealed secret */
  sealedSecretName: string
  /** SealedSecret object that contains updated values */
  body: {
    name: string
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData: {
      additionalProperties?: string
    }
    metadata?: {
      annotations?: {
        additionalProperties?: string
      }
      finalizers?: string[]
      labels?: {
        additionalProperties?: string
      }
    }
  }
}
export type DeleteSealedSecretApiResponse = /** status 200 Successfully deleted a team sealed secret */ undefined
export type DeleteSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the sealed secret */
  sealedSecretName: string
}
export type GetAllAplSecretsApiResponse = /** status 200 Successfully obtained all secrets */ ({
  kind: 'AplTeamSecret'
  spec: {
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData?: {
      [key: string]: string
    }
    metadata?: {
      annotations?: {
        [key: string]: string
      }
      labels?: {
        [key: string]: string
      }
      finalizers?: string[]
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplSecretsApiArg = void
export type GetAplSealedSecretsApiResponse = /** status 200 Successfully obtained sealed secrets */ ({
  kind: 'AplTeamSecret'
  spec: {
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData?: {
      [key: string]: string
    }
    metadata?: {
      annotations?: {
        [key: string]: string
      }
      labels?: {
        [key: string]: string
      }
      finalizers?: string[]
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAplSealedSecretsApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplSealedSecretApiResponse = /** status 200 Successfully stored sealed secret configuration */ {
  kind: 'AplTeamSecret'
  spec: {
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData?: {
      [key: string]: string
    }
    metadata?: {
      annotations?: {
        [key: string]: string
      }
      labels?: {
        [key: string]: string
      }
      finalizers?: string[]
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** SealedSecret object */
  body: {
    kind: 'AplTeamSecret'
    spec: {
      namespace?: string
      immutable?: boolean
      type:
        | 'kubernetes.io/opaque'
        | 'kubernetes.io/dockercfg'
        | 'kubernetes.io/dockerconfigjson'
        | 'kubernetes.io/basic-auth'
        | 'kubernetes.io/ssh-auth'
        | 'kubernetes.io/tls'
      encryptedData?: {
        [key: string]: string
      }
      metadata?: {
        annotations?: {
          [key: string]: string
        }
        labels?: {
          [key: string]: string
        }
        finalizers?: string[]
      }
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type GetAplSealedSecretApiResponse = /** status 200 Successfully obtained sealed secret configuration */ {
  kind: 'AplTeamSecret'
  spec: {
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData?: {
      [key: string]: string
    }
    metadata?: {
      annotations?: {
        [key: string]: string
      }
      labels?: {
        [key: string]: string
      }
      finalizers?: string[]
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the sealed secret */
  sealedSecretName: string
}
export type EditAplSealedSecretApiResponse = /** status 200 Successfully edited a team sealed secret */ {
  kind: 'AplTeamSecret'
  spec: {
    namespace?: string
    immutable?: boolean
    type:
      | 'kubernetes.io/opaque'
      | 'kubernetes.io/dockercfg'
      | 'kubernetes.io/dockerconfigjson'
      | 'kubernetes.io/basic-auth'
      | 'kubernetes.io/ssh-auth'
      | 'kubernetes.io/tls'
    encryptedData?: {
      [key: string]: string
    }
    metadata?: {
      annotations?: {
        [key: string]: string
      }
      labels?: {
        [key: string]: string
      }
      finalizers?: string[]
    }
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplSealedSecretApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the sealed secret */
  sealedSecretName: string
  /** SealedSecret object that contains updated values */
  body: {
    kind: 'AplTeamSecret'
    spec: {
      namespace?: string
      immutable?: boolean
      type:
        | 'kubernetes.io/opaque'
        | 'kubernetes.io/dockercfg'
        | 'kubernetes.io/dockerconfigjson'
        | 'kubernetes.io/basic-auth'
        | 'kubernetes.io/ssh-auth'
        | 'kubernetes.io/tls'
      encryptedData?: {
        [key: string]: string
      }
      metadata?: {
        annotations?: {
          [key: string]: string
        }
        labels?: {
          [key: string]: string
        }
        finalizers?: string[]
      }
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplSealedSecretApiResponse = /** status 200 Successfully deleted a team sealed secret */ undefined
export type DeleteAplSealedSecretApiArg = {
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
  teamId: string
  /** Name of the network policy */
  netpolName: string
}
export type GetAllAplNetpolsApiResponse = /** status 200 Successfully obtained all network policy configuration */ ({
  kind: 'AplTeamNetworkControl'
  spec: {
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplNetpolsApiArg = void
export type GetTeamAplNetpolsApiResponse = /** status 200 Successfully obtained team network policy configuration */ ({
  kind: 'AplTeamNetworkControl'
  spec: {
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplNetpolsApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplNetpolApiResponse = /** status 200 Successfully stored network policy configuration */ {
  kind: 'AplTeamNetworkControl'
  spec: {
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplNetpolApiArg = {
  /** ID of team */
  teamId: string
  /** Network policy object */
  body: {
    kind: 'AplTeamNetworkControl'
    spec: {
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
  } & {
    metadata: {
      name: string
    }
  }
}
export type GetAplNetpolApiResponse = /** status 200 Successfully obtained network policy configuration */ {
  kind: 'AplTeamNetworkControl'
  spec: {
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplNetpolApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the network policy */
  netpolName: string
}
export type EditAplNetpolApiResponse = /** status 200 Successfully edited a team network policy */ {
  kind: 'AplTeamNetworkControl'
  spec: {
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplNetpolApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the network policy */
  netpolName: string
  /** Netwok policy object that contains updated values */
  body: {
    kind: 'AplTeamNetworkControl'
    spec: {
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
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplNetpolApiResponse = /** status 200 Successfully deleted a team network policy */ undefined
export type DeleteAplNetpolApiArg = {
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
export type GetAllAplBackupsApiResponse = /** status 200 Successfully obtained all backups configuration */ ({
  kind: 'AplTeamBackup'
  spec: {
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplBackupsApiArg = void
export type GetTeamAplBackupsApiResponse = /** status 200 Successfully obtained team backups configuration */ ({
  kind: 'AplTeamBackup'
  spec: {
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplBackupsApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplBackupApiResponse = /** status 200 Successfully stored backup configuration */ {
  kind: 'AplTeamBackup'
  spec: {
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplBackupApiArg = {
  /** ID of team */
  teamId: string
  /** Backup object */
  body: {
    kind: 'AplTeamBackup'
    spec: {
      schedule: string
      snapshotVolumes?: boolean
      labelSelector?: {
        name?: string
        value?: string
      }[]
      ttl: string
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplBackupApiResponse = /** status 200 Successfully deleted a backup */ undefined
export type DeleteAplBackupApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the backup */
  backupName: string
}
export type GetAplBackupApiResponse = /** status 200 Successfully obtained backup configuration */ {
  kind: 'AplTeamBackup'
  spec: {
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplBackupApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the backup */
  backupName: string
}
export type EditAplBackupApiResponse = /** status 200 Successfully edited a team backup */ {
  kind: 'AplTeamBackup'
  spec: {
    schedule: string
    snapshotVolumes?: boolean
    labelSelector?: {
      name?: string
      value?: string
    }[]
    ttl: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplBackupApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the backup */
  backupName: string
  /** Backup object that contains updated values */
  body: {
    kind: 'AplTeamBackup'
    spec: {
      schedule: string
      snapshotVolumes?: boolean
      labelSelector?: {
        name?: string
        value?: string
      }[]
      ttl: string
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type GetDashboardApiResponse = /** status 200 Successfully obtained dashboard inventory data */ object
export type GetDashboardApiArg = {
  /** Name of the team */
  teamName?: string
}
export type GetAllBuildsApiResponse = /** status 200 Successfully obtained all builds configuration */ {
  id?: string
  teamId?: string
  name: string
  imageName?: string
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
  /** ID of team */
  teamId: string
}
export type CreateBuildApiResponse = /** status 200 Successfully stored build configuration */ {
  id?: string
  teamId?: string
  name: string
  imageName?: string
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
  /** ID of team */
  teamId: string
  /** Build object */
  body: {
    id?: string
    teamId?: string
    name: string
    imageName?: string
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
  /** ID of team */
  teamId: string
  /** Name of the build */
  buildName: string
}
export type GetBuildApiResponse = /** status 200 Successfully obtained build configuration */ {
  id?: string
  teamId?: string
  name: string
  imageName?: string
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
  /** ID of team */
  teamId: string
  /** Name of the build */
  buildName: string
}
export type EditBuildApiResponse = /** status 200 Successfully edited a team build */ {
  id?: string
  teamId?: string
  name: string
  imageName?: string
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
  /** ID of team */
  teamId: string
  /** Name of the build */
  buildName: string
  /** Build object that contains updated values */
  body: {
    id?: string
    teamId?: string
    name: string
    imageName?: string
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
export type GetAllAplBuildsApiResponse = /** status 200 Successfully obtained all builds configuration */ ({
  kind: 'AplTeamBuild'
  spec: {
    imageName?: string
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplBuildsApiArg = void
export type GetTeamAplBuildsApiResponse = /** status 200 Successfully obtained team builds configuration */ ({
  kind: 'AplTeamBuild'
  spec: {
    imageName?: string
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplBuildsApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplBuildApiResponse = /** status 200 Successfully stored build configuration */ {
  kind: 'AplTeamBuild'
  spec: {
    imageName?: string
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplBuildApiArg = {
  /** ID of team */
  teamId: string
  /** Build object */
  body: {
    kind: 'AplTeamBuild'
    spec: {
      imageName?: string
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
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplBuildApiResponse = /** status 200 Successfully deleted a build */ undefined
export type DeleteAplBuildApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the build */
  buildName: string
}
export type GetAplBuildApiResponse = /** status 200 Successfully obtained build configuration */ {
  kind: 'AplTeamBuild'
  spec: {
    imageName?: string
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplBuildApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the build */
  buildName: string
}
export type EditAplBuildApiResponse = /** status 200 Successfully edited a team build */ {
  kind: 'AplTeamBuild'
  spec: {
    imageName?: string
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
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplBuildApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the build */
  buildName: string
  /** Build object that contains updated values */
  body: {
    kind: 'AplTeamBuild'
    spec: {
      imageName?: string
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
  } & {
    metadata: {
      name: string
    }
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
  /** ID of team */
  teamId: string
}
export type GetPolicyApiResponse = /** status 200 Successfully obtained policy configuration */ {
  action: 'Audit' | 'Enforce'
  severity: 'low' | 'medium' | 'high'
  customValues?: string[]
}
export type GetPolicyApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the policy */
  policyName: string
}
export type EditPolicyApiResponse = /** status 200 Successfully edited a team policy */ {
  action: 'Audit' | 'Enforce'
  severity: 'low' | 'medium' | 'high'
  customValues?: string[]
}
export type EditPolicyApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the policy */
  policyName: string
  /** Policy object that contains updated values */
  body: {
    action: 'Audit' | 'Enforce'
    severity: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
}
export type GetAllAplPoliciesApiResponse = /** status 200 Successfully obtained all policy configuration */ ({
  kind: 'AplTeamPolicy'
  spec: {
    action: 'Audit' | 'Enforce'
    severity: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplPoliciesApiArg = void
export type GetTeamAplPoliciesApiResponse = /** status 200 Successfully obtained team policy configuration */ ({
  kind: 'AplTeamPolicy'
  spec: {
    action: 'Audit' | 'Enforce'
    severity: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplPoliciesApiArg = {
  /** ID of team */
  teamId: string
}
export type GetAplPolicyApiResponse = /** status 200 Successfully obtained policy configuration */ {
  kind: 'AplTeamPolicy'
  spec: {
    action: 'Audit' | 'Enforce'
    severity: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplPolicyApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the policy */
  policyName: string
}
export type EditAplPolicyApiResponse = /** status 200 Successfully edited a team policy */ {
  kind: 'AplTeamPolicy'
  spec: {
    action: 'Audit' | 'Enforce'
    severity: 'low' | 'medium' | 'high'
    customValues?: string[]
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplPolicyApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the policy */
  policyName: string
  /** Policy object that contains updated values */
  body: {
    kind: 'AplTeamPolicy'
    spec: {
      action: 'Audit' | 'Enforce'
      severity: 'low' | 'medium' | 'high'
      customValues?: string[]
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type GetK8SVersionApiResponse = /** status 200 Successfully obtained k8s version */ string
export type GetK8SVersionApiArg = void
export type ConnectAplCloudttyApiResponse = /** status 200 Successfully stored cloudtty configuration */ {
  iFrameUrl?: string
}
export type ConnectAplCloudttyApiArg = {
  /** Id of the team */
  teamId?: string
}
export type DeleteAplCloudttyApiResponse = unknown
export type DeleteAplCloudttyApiArg = void
export type ConnectCloudttyApiResponse = /** status 200 Successfully stored cloudtty configuration */ {
  iFrameUrl?: string
}
export type ConnectCloudttyApiArg = {
  /** Id of the team */
  teamId?: string
}
export type DeleteCloudttyApiResponse = unknown
export type DeleteCloudttyApiArg = void
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
  teams?: string[]
}[]
export type EditTeamUsersApiArg = {
  /** ID of team */
  teamId: string
  /** User object that contains updated values */
  body: {
    id?: string
    teams?: string[]
  }[]
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
  teamId: string
  /** Name of the code repository */
  codeRepositoryName: string
}
export type GetAllAplCodeReposApiResponse = /** status 200 Successfully obtained all code repositories */ ({
  kind: 'AplTeamCodeRepo'
  spec: {
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplCodeReposApiArg = void
export type GetTeamAplCodeReposApiResponse = /** status 200 Successfully obtained code repositories */ ({
  kind: 'AplTeamCodeRepo'
  spec: {
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplCodeReposApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplCodeRepoApiResponse = /** status 200 Successfully stored code repo configuration */ {
  kind: 'AplTeamCodeRepo'
  spec: {
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplCodeRepoApiArg = {
  /** ID of team */
  teamId: string
  /** CodeRepo object */
  body: {
    kind: 'AplTeamCodeRepo'
    spec: {
      gitService: 'gitea' | 'github' | 'gitlab'
      repositoryUrl: string
      private?: boolean
      secret?: string
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type GetAplCodeRepoApiResponse = /** status 200 Successfully obtained code repo configuration */ {
  kind: 'AplTeamCodeRepo'
  spec: {
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplCodeRepoApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the code repository */
  codeRepositoryName: string
}
export type EditAplCodeRepoApiResponse = /** status 200 Successfully edited a team code repo */ {
  kind: 'AplTeamCodeRepo'
  spec: {
    gitService: 'gitea' | 'github' | 'gitlab'
    repositoryUrl: string
    private?: boolean
    secret?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplCodeRepoApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the code repository */
  codeRepositoryName: string
  /** CodeRepo object that contains updated values */
  body: {
    kind: 'AplTeamCodeRepo'
    spec: {
      gitService: 'gitea' | 'github' | 'gitlab'
      repositoryUrl: string
      private?: boolean
      secret?: string
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplCodeRepoApiResponse = /** status 200 Successfully deleted a team code repo */ undefined
export type DeleteAplCodeRepoApiArg = {
  /** ID of team */
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
export type WorkloadCatalogApiResponse = /** status 200 Successfully updated a team workload catalog */ object
export type WorkloadCatalogApiArg = {
  /** Workload catalog object that contains updated values */
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
export type CreateWorkloadCatalogApiResponse = /** status 200 Successfully updated a team workload catalog */ object
export type CreateWorkloadCatalogApiArg = {
  /** Workload catalog object that contains updated values */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  /** ID of team */
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
  values: object | string
}
export type GetWorkloadValuesApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the workload */
  workloadName: string
}
export type EditWorkloadValuesApiResponse = /** status 200 Successfully edited workload values */ {
  id?: string
  teamId?: string
  name?: string
  values: object | string
}
export type EditWorkloadValuesApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the workload */
  workloadName: string
  /** Workload values */
  body: {
    id?: string
    teamId?: string
    name?: string
    values: object | string
  }
}
export type GetAllAplWorkloadsApiResponse = /** status 200 Successfully obtained all workloads configuration */ ({
  kind: 'AplTeamWorkload'
  spec: {
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
    values?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetAllAplWorkloadsApiArg = void
export type GetTeamAplWorkloadsApiResponse = /** status 200 Successfully obtained team workloads configuration */ ({
  kind: 'AplTeamWorkload'
  spec: {
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
    values?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
})[]
export type GetTeamAplWorkloadsApiArg = {
  /** ID of team */
  teamId: string
}
export type CreateAplWorkloadApiResponse = /** status 200 Successfully stored workload configuration */ {
  kind: 'AplTeamWorkload'
  spec: {
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
    values?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type CreateAplWorkloadApiArg = {
  /** ID of team */
  teamId: string
  /** Workload object */
  body: {
    kind: 'AplTeamWorkload'
    spec: {
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
      values?: string
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type DeleteAplWorkloadApiResponse = /** status 200 Successfully deleted a workload */ undefined
export type DeleteAplWorkloadApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the workload */
  workloadName: string
}
export type GetAplWorkloadApiResponse = /** status 200 Successfully obtained workload configuration */ {
  kind: 'AplTeamWorkload'
  spec: {
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
    values?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type GetAplWorkloadApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the workload */
  workloadName: string
}
export type EditAplWorkloadApiResponse = /** status 200 Successfully edited a team workload */ {
  kind: 'AplTeamWorkload'
  spec: {
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
    values?: string
  }
} & {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
} & {
  status: {
    conditions?: {
      lastTransitionTime?: string
      message?: string
      reason?: string
      status?: boolean
      type?: string
    }[]
    phase?: string
  }
}
export type EditAplWorkloadApiArg = {
  /** ID of team */
  teamId: string
  /** Name of the workload */
  workloadName: string
  /** Workload object that contains updated values */
  body: {
    kind: 'AplTeamWorkload'
    spec: {
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
      values?: string
    }
  } & {
    metadata: {
      name: string
    }
  }
}
export type DownloadKubecfgApiResponse = /** status 200 Succesfully finished the download */ Blob
export type DownloadKubecfgApiArg = {
  /** ID of team */
  teamId: string
}
export type DownloadDockerConfigApiResponse = /** status 200 Succesfully finished the download */ Blob
export type DownloadDockerConfigApiArg = {
  /** ID of team */
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
  sealedSecretsPEM?: string
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
export type V1ApiDocsApiResponse = /** status 200 The requested apiDoc. */ object
export type V1ApiDocsApiArg = void
export type GetSettingsInfoApiResponse = /** status 200 The request is successful. */ {
  cluster?: {
    name?: string
    domainSuffix?: string
    apiServer?: string
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
  /** Name of the code repository */
  codeRepoName?: string
  /** Id of the team */
  teamId?: string
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
    receivers?: ('slack' | 'msteams' | 'none')[]
    slack?: {
      channel?: string
      channelCrit?: string
      url?: string
    }
    msteams?: {
      highPrio?: string
      lowPrio?: string
    }
  }
  cluster?: {
    name: string
    domainSuffix?: string
    apiServer?: string
    k8sContext?: string
    owner?: string
    provider: 'linode' | 'custom'
    defaultStorageClass?: string
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
              'kubeflow-pipelines'?: string
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
    useORCS?: boolean
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
      receivers?: ('slack' | 'msteams' | 'none')[]
      slack?: {
        channel?: string
        channelCrit?: string
        url?: string
      }
      msteams?: {
        highPrio?: string
        lowPrio?: string
      }
    }
    cluster?: {
      name: string
      domainSuffix?: string
      apiServer?: string
      k8sContext?: string
      owner?: string
      provider: 'linode' | 'custom'
      defaultStorageClass?: string
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
                'kubeflow-pipelines'?: string
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
      useORCS?: boolean
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
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetTeamQuery,
  useEditTeamMutation,
  useDeleteTeamMutation,
  useGetAplTeamsQuery,
  useCreateAplTeamMutation,
  useGetAplTeamQuery,
  useEditAplTeamMutation,
  useDeleteAplTeamMutation,
  useGetAllServicesQuery,
  useGetTeamServicesQuery,
  useCreateServiceMutation,
  useGetTeamK8SServicesQuery,
  useGetK8SWorkloadPodLabelsQuery,
  useListUniquePodNamesByLabelQuery,
  useGetServiceQuery,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useGetAllAplServicesQuery,
  useGetTeamAplServicesQuery,
  useCreateAplServiceMutation,
  useGetAplServiceQuery,
  useEditAplServiceMutation,
  useDeleteAplServiceMutation,
  useGetAllSealedSecretsQuery,
  useDownloadSealedSecretKeysQuery,
  useGetSecretsFromK8SQuery,
  useGetSealedSecretsQuery,
  useCreateSealedSecretMutation,
  useGetSealedSecretQuery,
  useEditSealedSecretMutation,
  useDeleteSealedSecretMutation,
  useGetAllAplSecretsQuery,
  useGetAplSealedSecretsQuery,
  useCreateAplSealedSecretMutation,
  useGetAplSealedSecretQuery,
  useEditAplSealedSecretMutation,
  useDeleteAplSealedSecretMutation,
  useGetAllNetpolsQuery,
  useGetTeamNetpolsQuery,
  useCreateNetpolMutation,
  useGetNetpolQuery,
  useEditNetpolMutation,
  useDeleteNetpolMutation,
  useGetAllAplNetpolsQuery,
  useGetTeamAplNetpolsQuery,
  useCreateAplNetpolMutation,
  useGetAplNetpolQuery,
  useEditAplNetpolMutation,
  useDeleteAplNetpolMutation,
  useGetAllBackupsQuery,
  useGetTeamBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useGetBackupQuery,
  useEditBackupMutation,
  useGetAllAplBackupsQuery,
  useGetTeamAplBackupsQuery,
  useCreateAplBackupMutation,
  useDeleteAplBackupMutation,
  useGetAplBackupQuery,
  useEditAplBackupMutation,
  useGetDashboardQuery,
  useGetAllBuildsQuery,
  useGetTeamBuildsQuery,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useGetBuildQuery,
  useEditBuildMutation,
  useGetAllAplBuildsQuery,
  useGetTeamAplBuildsQuery,
  useCreateAplBuildMutation,
  useDeleteAplBuildMutation,
  useGetAplBuildQuery,
  useEditAplBuildMutation,
  useGetAllPoliciesQuery,
  useGetTeamPoliciesQuery,
  useGetPolicyQuery,
  useEditPolicyMutation,
  useGetAllAplPoliciesQuery,
  useGetTeamAplPoliciesQuery,
  useGetAplPolicyQuery,
  useEditAplPolicyMutation,
  useGetK8SVersionQuery,
  useConnectAplCloudttyQuery,
  useDeleteAplCloudttyMutation,
  useConnectCloudttyQuery,
  useDeleteCloudttyMutation,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useEditTeamUsersMutation,
  useGetAllCodeReposQuery,
  useGetTeamCodeReposQuery,
  useCreateCodeRepoMutation,
  useGetCodeRepoQuery,
  useEditCodeRepoMutation,
  useDeleteCodeRepoMutation,
  useGetAllAplCodeReposQuery,
  useGetTeamAplCodeReposQuery,
  useCreateAplCodeRepoMutation,
  useGetAplCodeRepoQuery,
  useEditAplCodeRepoMutation,
  useDeleteAplCodeRepoMutation,
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
  useGetAllAplWorkloadsQuery,
  useGetTeamAplWorkloadsQuery,
  useCreateAplWorkloadMutation,
  useDeleteAplWorkloadMutation,
  useGetAplWorkloadQuery,
  useEditAplWorkloadMutation,
  useDownloadKubecfgQuery,
  useDownloadDockerConfigQuery,
  useGetSessionQuery,
  useV1ApiDocsQuery,
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
