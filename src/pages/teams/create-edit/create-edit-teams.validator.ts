import * as yup from 'yup'

// alerts schema (under spec.alerts)
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

// selfService schema (under spec.selfService)
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

export const createAplTeamApiSchema = yup.object({
  kind: yup.string().oneOf(['AplTeamSettingSet']).required(),

  spec: yup.object({
    oidc: yup
      .object({
        groupMapping: yup.string().optional(),
      })
      .optional(),

    password: yup.string().optional(),

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
        { name: 'requests.cpu', value: '24' },
        { name: 'requests.memory', value: '32' },
        { name: 'pods', value: '50' },
      ]),

    networkPolicy: yup
      .object({
        ingressPrivate: yup.boolean().optional(),
        egressPublic: yup.boolean().optional(),
      })
      .optional(),

    selfService: selfServiceSchema.optional(),
  }),

  metadata: yup.object({
    name: yup
      .string()
      .required('Team name is required')
      .min(3, 'Team name must be at least 3 characters')
      .max(9, 'Team name must not exceed 9 characters')
      .matches(/^[^A-Z_]*$/, 'Team name cannot contain capital letters or underscores'),

    labels: yup.object({
      // keep optional if create does not have a teamId yet; if backend requires it, make this .required()
      'apl.io/teamId': yup.string().optional(),
    }),
  }),

  status: yup.object({
    conditions: yup
      .array(
        yup.object({
          lastTransitionTime: yup.string().optional(),
          message: yup.string().optional(),
          reason: yup.string().optional(),
          status: yup.boolean().optional(),
          type: yup.string().optional(),
        }),
      )
      .optional(),
    phase: yup.string().optional(),
  }),
})
