import * as yup from 'yup'

// Define a schema for a responder used in alerts.opsgenie.responders
const responderSchema = yup
  .object({
    type: yup
      .string()
      .oneOf(['team', 'user', 'escalation', 'schedule'], 'Invalid responder type')
      .required('Responder type is required'),
    // Only one of these should be provided – we require at least one.
    id: yup.string(),
    name: yup.string(),
    username: yup.string(),
  })
  .test('at-least-one', 'At least one of id, name, or username must be provided', (value) =>
    Boolean(value && (value.id || value.name || value.username)),
  )

// Define the alerts schema
const alertsSchema = yup.object({
  repeatInterval: yup.string().optional(),
  groupInterval: yup.string().optional(),
  receivers: yup
    .array()
    .of(yup.string().oneOf(['slack', 'msteams', 'opsgenie', 'email', 'none']))
    .optional(),
  slack: yup
    .object({
      channel: yup.string().optional(),
      channelCrit: yup.string().optional(),
      url: yup.string().optional(),
    })
    .optional(),
  msteams: yup
    .object({
      highPrio: yup.string().optional(),
      lowPrio: yup.string().optional(),
    })
    .optional(),
})

// Define the selfService schema
const selfServiceSchema = yup.object({
  teamMembers: yup
    .object({
      createServices: yup.boolean().required('Create services permission is required'),
      editSecurityPolicies: yup.boolean().required('Edit security policies permission is required'),
      useCloudShell: yup.boolean().required('Cloud shell usage permission is required'),
      downloadKubeconfig: yup.boolean().required('Download kubeconfig permission is required'),
      downloadDockerLogin: yup.boolean().required('Download docker login permission is required'),
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
  enabled: yup.boolean().default(true),
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
  customQuota: yup.array().of(resourceQuotaItemSchema).default([]),
})

// Main CreateTeamApiResponse schema
export const createTeamApiResponseSchema = yup.object({
  id: yup.string().optional(),
  name: yup.string().required('Team name is required'),
  oidc: yup
    .object({
      groupMapping: yup.string().optional(),
    })
    .optional(),
  password: yup.string().optional(),
  managedMonitoring: yup
    .object({
      grafana: yup.boolean().optional(),
      alertmanager: yup.boolean().optional(),
    })
    .optional(),
  alerts: alertsSchema.optional(),
  resourceQuota: resourceQuotaObjectSchema.default({
    enabled: true,
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
      ingressPrivate: yup.boolean().optional(),
      egressPublic: yup.boolean().optional(),
    })
    .optional(),
  selfService: selfServiceSchema.optional(),
})
