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
  opsgenie: yup
    .object({
      apiKey: yup.string().optional(),
      url: yup.string().optional(),
      responders: yup.array().of(responderSchema).optional(),
    })
    .optional(),
  email: yup
    .object({
      critical: yup.string().optional(),
      nonCritical: yup.string().optional(),
    })
    .optional(),
})

// Define the selfService schema
const selfServiceSchema = yup.object({
  service: yup
    .array()
    .of(yup.string().oneOf(['ingress']))
    .optional(),
  policies: yup
    .array()
    .of(yup.string().oneOf(['edit policies']))
    .optional(),
  team: yup
    .array()
    .of(yup.string().oneOf(['oidc', 'managedMonitoring', 'alerts', 'resourceQuota', 'networkPolicy']))
    .optional(),
  apps: yup
    .array()
    .of(yup.string().oneOf(['argocd', 'gitea']))
    .optional(),
  access: yup
    .array()
    .of(yup.string().oneOf(['shell', 'downloadKubeConfig', 'downloadDockerConfig', 'downloadCertificateAuthority']))
    .optional(),
})

// Define the resourceQuota schema
const resourceQuotaSchema = yup.array().of(
  yup.object({
    name: yup.string().required('Resource quota name is required'),
    value: yup.string().required('Resource quota value is required'),
  }),
)

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
  resourceQuota: resourceQuotaSchema.optional(),
  networkPolicy: yup
    .object({
      ingressPrivate: yup.boolean().optional(),
      egressPublic: yup.boolean().optional(),
    })
    .optional(),
  selfService: selfServiceSchema.optional(),
})
