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
      createServices: yup.boolean().required('Create services permission is required').default(true),
      editSecurityPolicies: yup.boolean().required('Edit security policies permission is required').default(true),
      useCloudShell: yup.boolean().required('Cloud shell usage permission is required').default(true),
      downloadKubeconfig: yup.boolean().required('Download kubeconfig permission is required').default(true),
      downloadDockerLogin: yup.boolean().required('Download docker login permission is required').default(true),
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

// Main CreateTeamApiResponse schema
export const createTeamApiResponseSchema = yup.object({
  id: yup.string().optional().default(undefined),
  name: yup.string().required('Team name is required').max(30, 'Team name must be at most 30 characters'),
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
  resourceQuota: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required('Resource quota name is required'),
        value: yup.string().required('Resource quota value is required'),
      }),
    )
    .default([
      { name: 'services.loadbalancers', value: '0' },
      { name: 'services.nodeports', value: '0' },
      { name: 'limits.cpu', value: '24' },
      { name: 'requests.cpu', value: '24' },
      { name: 'limits.memory', value: '32Gi' },
      { name: 'requests.memory', value: '32Gi' },
      { name: 'count/pods', value: '50' },
    ]),
  networkPolicy: yup
    .object({
      ingressPrivate: yup.boolean().optional().default(true),
      egressPublic: yup.boolean().optional().default(true),
    })
    .optional(),
  selfService: selfServiceSchema.optional(),
})
