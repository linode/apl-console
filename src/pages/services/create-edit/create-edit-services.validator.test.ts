import { serviceApiResponseSchema } from './create-edit-services.validator'

const baseService = {
  kind: 'AplTeamService',
  metadata: {
    name: 'my-service',
    labels: {
      'apl.io/teamId': 'team1',
    },
  },
  spec: {
    namespace: 'team-team1',
    port: 8080,
    ksvc: {
      predeployed: false,
    },
    trafficControl: {
      enabled: false,
    },
    useCname: false,
    cname: {
      domain: '',
      tlsSecretName: 'empty',
    },
    paths: [],
    headers: {
      response: {
        set: [],
      },
    },
  },
  status: {
    conditions: [],
  },
}

describe('serviceApiResponseSchema', () => {
  describe('name validation', () => {
    it('accepts a valid service name', async () => {
      await expect(serviceApiResponseSchema.validate(baseService)).resolves.toBeTruthy()
    })

    it('requires a service name', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          metadata: {
            ...baseService.metadata,
            name: '',
          },
        }),
      ).rejects.toThrow('Name is required')
    })

    it('requires a service name of at least 2 characters', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          metadata: {
            ...baseService.metadata,
            name: 'a',
          },
        }),
      ).rejects.toThrow('Name must be at least 2 characters long.')
    })

    it('rejects an existing service name', async () => {
      await expect(
        serviceApiResponseSchema.validate(baseService, {
          context: {
            validateOnSubmit: true,
            existingNames: ['my-service'],
            domainSuffix: 'example.com',
          },
        }),
      ).rejects.toThrow('Service name already exists.')
    })

    it('accepts a unique service name', async () => {
      await expect(
        serviceApiResponseSchema.validate(baseService, {
          context: {
            validateOnSubmit: true,
            existingNames: ['other-service'],
            domainSuffix: 'example.com',
          },
        }),
      ).resolves.toBeTruthy()
    })

    it('skips duplicate validation when validateOnSubmit is false', async () => {
      await expect(
        serviceApiResponseSchema.validate(baseService, {
          context: {
            validateOnSubmit: false,
            existingNames: ['my-service'],
            domainSuffix: 'example.com',
          },
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('metadata validation', () => {
    it('requires a team ID label', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          metadata: {
            ...baseService.metadata,
            labels: {
              'apl.io/teamId': '',
            },
          },
        }),
      ).rejects.toThrow('Team ID is required')
    })
  })

  describe('path validation', () => {
    it('accepts empty paths when forwardPath is not enabled', async () => {
      await expect(serviceApiResponseSchema.validate(baseService)).resolves.toBeTruthy()
    })

    it('rejects an empty path value', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            paths: [''],
          },
        }),
      ).rejects.toThrow('Paths cannot have empty values if "forwardPath" is enabled or not')
    })

    it('rejects paths containing a slash', async () => {
      await expect(
        serviceApiResponseSchema.validate(
          {
            ...baseService,
            spec: {
              ...baseService.spec,
              paths: ['api/v1'],
            },
          },
          {
            abortEarly: false,
          },
        ),
      ).rejects.toMatchObject({
        inner: expect.arrayContaining([
          expect.objectContaining({
            path: 'ingress.paths.root',
            message: 'Url Paths cannot contain a "/"',
          }),
        ]),
      })
    })

    it('accepts paths without slashes', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            paths: ['api', 'health'],
          },
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('CNAME validation', () => {
    it('accepts an empty CNAME configuration', async () => {
      await expect(
        serviceApiResponseSchema.validate(baseService, {
          context: {
            domainSuffix: 'example.com',
          },
        }),
      ).resolves.toBeTruthy()
    })

    it('requires both domain and TLS secret', async () => {
      await expect(
        serviceApiResponseSchema.validate(
          {
            ...baseService,
            spec: {
              ...baseService.spec,
              cname: {
                domain: 'service.example.org',
                tlsSecretName: '',
              },
            },
          },
          {
            context: {
              domainSuffix: 'example.com',
            },
          },
        ),
      ).rejects.toThrow('Both domain and tlsSecretName must be filled or empty')
    })

    it('rejects a CNAME containing the cluster domain suffix', async () => {
      await expect(
        serviceApiResponseSchema.validate(
          {
            ...baseService,
            spec: {
              ...baseService.spec,
              cname: {
                domain: 'service.example.com',
                tlsSecretName: 'tls-secret',
              },
            },
          },
          {
            context: {
              domainSuffix: 'example.com',
            },
          },
        ),
      ).rejects.toThrow('CNAME cannot contain domain suffix')
    })

    it('accepts a CNAME outside the cluster domain suffix', async () => {
      await expect(
        serviceApiResponseSchema.validate(
          {
            ...baseService,
            spec: {
              ...baseService.spec,
              cname: {
                domain: 'service.example.org',
                tlsSecretName: 'tls-secret',
              },
            },
          },
          {
            context: {
              domainSuffix: 'example.com',
            },
          },
        ),
      ).resolves.toBeTruthy()
    })

    it('requires a TLS secret name of at least 2 characters', async () => {
      await expect(
        serviceApiResponseSchema.validate(
          {
            ...baseService,
            spec: {
              ...baseService.spec,
              cname: {
                domain: 'service.example.org',
                tlsSecretName: 'a',
              },
            },
          },
          {
            context: {
              domainSuffix: 'example.com',
            },
          },
        ),
      ).rejects.toThrow('TLS secret name must be at least 2 characters long.')
    })
  })

  describe('traffic control validation', () => {
    it('requires weightV1 when traffic control is enabled', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            trafficControl: {
              enabled: true,
              weightV2: 50,
            },
          },
        }),
      ).rejects.toThrow('WeightV1 is required when "trafficControl" is enabled')
    })

    it('requires weightV2 when traffic control is enabled', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            trafficControl: {
              enabled: true,
              weightV1: 50,
            },
          },
        }),
      ).rejects.toThrow('WeightV2 is required when "trafficControl" is enabled')
    })

    it('rejects traffic weights below 0', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            trafficControl: {
              enabled: true,
              weightV1: -1,
              weightV2: 100,
            },
          },
        }),
      ).rejects.toThrow('Must be a minimum of 0')
    })

    it('rejects traffic weights above 100', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            trafficControl: {
              enabled: true,
              weightV1: 101,
              weightV2: 0,
            },
          },
        }),
      ).rejects.toThrow('Must be a maximum of 100')
    })

    it('accepts valid traffic weights', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            trafficControl: {
              enabled: true,
              weightV1: 60,
              weightV2: 40,
            },
          },
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('response header validation', () => {
    it('requires a response header name', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            headers: {
              response: {
                set: [
                  {
                    name: '',
                    value: 'nosniff',
                  },
                ],
              },
            },
          },
        }),
      ).rejects.toThrow('Header name is required')
    })

    it('requires a response header value', async () => {
      await expect(
        serviceApiResponseSchema.validate({
          ...baseService,
          spec: {
            ...baseService.spec,
            headers: {
              response: {
                set: [
                  {
                    name: 'X-Content-Type-Options',
                    value: '',
                  },
                ],
              },
            },
          },
        }),
      ).rejects.toThrow('Header value is required')
    })
  })
})
