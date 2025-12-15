import * as yup from 'yup'

export const createAplWorkloadApiResponseSchema = yup.object({
  kind: yup.string().oneOf(['AplTeamWorkload']).required(),

  spec: yup.object({
    icon: yup.string().optional(),
    url: yup.string().optional(),
    chartProvider: yup.string().oneOf(['helm', 'git']).optional(),
    path: yup.string().optional(),
    chart: yup.string().optional(),
    revision: yup.string().optional(),

    chartMetadata: yup
      .object({
        helmChartVersion: yup.string().optional(),
        helmChartDescription: yup.string().optional(),
      })
      .optional(),

    namespace: yup.string().optional(),
    createNamespace: yup.boolean().optional(),
    sidecarInject: yup.boolean().optional(),

    imageUpdateStrategy: yup.lazy((v) => {
      if (!v || typeof v !== 'object') return yup.mixed().notRequired()

      switch (v.type) {
        case 'disabled':
          return yup.object({
            type: yup.string().oneOf(['disabled']).required(),
          })

        case 'digest':
          return yup.object({
            type: yup.string().oneOf(['digest']).required(),
            digest: yup
              .object({
                imageRepository: yup.string().optional(),
                tag: yup.string().optional(),
                imageParameter: yup.string().optional(),
                tagParameter: yup.string().optional(),
              })
              .required(),
          })

        case 'semver':
          return yup.object({
            type: yup.string().oneOf(['semver']).required(),
            semver: yup
              .object({
                imageRepository: yup.string().optional(),
                versionConstraint: yup.string().required('A version constraint is required for Semver versioning'),
                imageParameter: yup.string().optional(),
                tagParameter: yup.string().optional(),
              })
              .required(),
          })

        default:
          return yup.mixed().notRequired()
      }
    }),

    values: yup.string().optional(),
  }),

  metadata: yup.object({
    name: yup.string().required('Workload name is required'),
    labels: yup.object({
      'apl.io/teamId': yup.string().required(),
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
