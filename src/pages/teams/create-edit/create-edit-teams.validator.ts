import * as yup from 'yup'

// Define the alerts schema
const alertsSchema = yup.object({
  repeatInterval: yup.string().optional().default(undefined),
  groupInterval: yup.string().optional().default(undefined),
  receivers: yup
    .array()
    .of(yup.string().oneOf(['slack', 'msteams', 'opsgenie', 'email', 'none']))
    .optional(),
  slack: yup
    .object({
      channel: yup.string().optional().default(undefined),
      channelCrit: yup.string().optional().default(undefined),
      url: yup.string().optional().default(undefined),
    })
    .optional(),
  msteams: yup
    .object({
      highPrio: yup.string().optional().default(undefined),
      lowPrio: yup.string().optional().default(undefined),
    })
    .optional(),
})

// Define the selfService schema
const selfServiceSchema = yup.object({
  teamMembers: yup
    .object({
      createServices: yup.boolean().required('Create services permission is required').default(false),
      editSecurityPolicies: yup.boolean().required('Edit security policies permission is required').default(false),
      useCloudShell: yup.boolean().required('Cloud shell usage permission is required').default(false),
      downloadKubeconfig: yup.boolean().required('Download kubeconfig permission is required').default(false),
      downloadDockerLogin: yup.boolean().required('Download docker login permission is required').default(false),
    })
    .required('Team members permissions are required'),
})

// Define a schema for a single ResourceQuota item.
const resourceQuotaItemSchema = yup.object({
  key: yup.string().required('Resource quota key is required'),
  value: yup.number().required('Resource quota value is required'),
  mutable: yup.boolean().optional(),
  decorator: yup.string().optional(),
})

// Define the resourceQuota object schema containing countQuota, computeResourceQuota, and customQuota.
const resourceQuotaObjectSchema = yup.object({
  enabled: yup.boolean().default(false),
  countQuota: yup
    .array()
    .of(resourceQuotaItemSchema)
    .default([
      { key: 'loadbalancers', value: 0, mutable: false, decorator: 'lbs' },
      { key: 'nodeports', value: 0, mutable: false, decorator: 'nprts' },
      { key: 'count', value: 5, mutable: true, decorator: 'pods' },
    ]),
  computeResourceQuota: yup
    .array()
    .of(resourceQuotaItemSchema)
    .default([
      { key: 'limits.cpu', value: 500, decorator: 'mCPUs' },
      { key: 'requests.cpu', value: 250, decorator: 'mCPUs' },
      { key: 'limits.memory', value: 500, decorator: 'Mi' },
      { key: 'requests.memory', value: 500, decorator: 'Mi' },
    ]),
  customQuota: yup
    .array()
    .of(resourceQuotaItemSchema)
    .default([])
    .test(
      'customQuota-not-default',
      'custom resource quota may not be the same as defined above',
      function (customQuota) {
        const countQuotaDefaults = [
          { key: 'loadbalancers', value: 0, mutable: false, decorator: 'lbs' },
          { key: 'nodeports', value: 0, mutable: false, decorator: 'nprts' },
          { key: 'count', value: 5, mutable: true, decorator: 'pods' },
        ]
        const computeQuotaDefaults = [
          { key: 'limits.cpu', value: 500, decorator: 'mCPUs' },
          { key: 'requests.cpu', value: 250, decorator: 'mCPUs' },
          { key: 'limits.memory', value: 500, decorator: 'Mi' },
          { key: 'requests.memory', value: 500, decorator: 'Mi' },
        ]
        const defaultQuotaKeys = new Set([...countQuotaDefaults, ...computeQuotaDefaults].map((quota) => quota.key))
        if (!customQuota) return true
        return customQuota.every((quota) => !defaultQuotaKeys.has(quota.key))
      },
    ),
})

// Main CreateTeamApiResponse schema
export const createTeamApiResponseSchema = yup.object({
  id: yup.string().optional().default(undefined),
  name: yup.string().required('Team name is required'),
  oidc: yup
    .object({
      groupMapping: yup.string().optional().default(undefined),
    })
    .optional(),
  password: yup.string().optional().default(undefined),
  managedMonitoring: yup
    .object({
      grafana: yup.boolean().optional().default(false),
      alertmanager: yup.boolean().optional().default(false),
    })
    .optional(),
  alerts: alertsSchema.optional(),
  resourceQuota: resourceQuotaObjectSchema.default({
    enabled: false,
    countQuota: [
      { key: 'loadbalancers', value: 0, mutable: false, decorator: 'lbs' },
      { key: 'nodeports', value: 0, mutable: false, decorator: 'nprts' },
      { key: 'count', value: 5, mutable: true, decorator: 'pods' },
    ],
    computeResourceQuota: [
      { key: 'limits.cpu', value: 500, decorator: 'mCPUs' },
      { key: 'requests.cpu', value: 250, decorator: 'mCPUs' },
      { key: 'limits.memory', value: 500, decorator: 'Mi' },
      { key: 'requests.memory', value: 500, decorator: 'Mi' },
    ],
    customQuota: [],
  }),
  networkPolicy: yup
    .object({
      ingressPrivate: yup.boolean().optional().default(true),
      egressPublic: yup.boolean().optional().default(true),
    })
    .optional(),
  selfService: selfServiceSchema.optional(),
})
