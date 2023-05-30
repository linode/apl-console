import { applyAclToUiSchema, getIngressSchemaPath, getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, isEmpty, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import {
  GetSecretsApiResponse,
  GetServiceApiResponse,
  GetSessionApiResponse,
  GetSettingsApiResponse,
  GetTeamK8SServicesApiResponse,
} from 'redux/otomiApi'
import { getStrict } from 'utils/schema'
import Form from './rjsf/Form'

const idxMap: Record<string, number> = {
  public: 1,
  tlsPass: 2,
}

export const addDomainEnumField = (
  schema: JSONSchema7,
  settings: GetSettingsApiResponse,
  formData: GetServiceApiResponse,
): void => {
  const { cluster, dns } = settings
  if (['cluster', 'tlsPass'].includes(formData?.ingress?.type)) return
  const ing = formData?.ingress as any
  const idx = idxMap[formData?.ingress?.type]
  if (!formData || isEmpty(ing)) return
  const ingressSchemaPath = getIngressSchemaPath(idx)
  const ingressSchema = getStrict(schema, ingressSchemaPath)
  const zones = [cluster.domainSuffix, ...(dns?.zones || [])]
  if (!ingressSchema) return
  if (ing.domain) {
    const { length } = ing.domain
    ingressSchema.subdomain.maxLength = 64 - length
  }
  // we only need to create an enum if we have more than one option
  if (ing.useDefaultSubdomain && !ing.domain) ing.domain = zones[0]
  if (zones.length > 1) ingressSchema.domain.enum = zones
  else if (!ing.domain) ing.domain = zones[0]
}

export const addServiceNameEnumField = (
  schema: JSONSchema7,
  k8sServices: GetTeamK8SServicesApiResponse,
  formData: GetServiceApiResponse,
): void => {
  const k8sService = k8sServices.filter((item) => item.name === formData?.name)
  if (k8sService.length === 0 && formData?.name) return

  const k8sServiceNames = k8sServices.map((item) => item.name)
  set(schema, 'properties.name.enum', k8sServiceNames)
  set(formData, 'ksvc.predeployed', false)
  if (formData && formData?.name) {
    set(schema, 'properties.port.enum', k8sService[0].ports)
    if (k8sService[0].managedByKnative) set(formData, 'ksvc.predeployed', true)
    unset(schema, 'properties.port.default')
  }
}

export const getServiceSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  formData: GetServiceApiResponse,
  teamId,
  secrets: Array<any>,
  k8sServices: GetTeamK8SServicesApiResponse,
): any => {
  const { cluster } = settings
  const schema = cloneDeep(getSpec().components.schemas.Service) as JSONSchema7
  // FIXME: add support for admin services
  if (teamId !== 'admin') addServiceNameEnumField(schema, k8sServices, formData)
  addDomainEnumField(schema, settings, formData)
  const ing = formData?.ingress as Record<string, any>
  const idx = idxMap[formData?.ingress?.type]
  if (idx) {
    const ingressSchemaPath = getIngressSchemaPath(idx)
    const ingressSchema = getStrict(schema, ingressSchemaPath)

    if (ing?.tlsPass) {
      unset(ingressSchema, 'auth')
      unset(ingressSchema, 'forwardPath')
      unset(ingressSchema, 'hasCert')
      unset(ingressSchema, 'path')
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    }
    if (cluster.provider !== 'aws') unset(ingressSchema, `certArn`)

    if (!ing?.hasCert) {
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    } else if (ing) {
      // Give the certName an enum selector with names of existing tls secrets
      if (ing.certSelect) {
        const tlsSecretNames = secrets.filter((s) => s.secret.type === 'tls').map((s) => s.name)
        set(ingressSchema, `certName.enum`, tlsSecretNames)
        if (secrets.length === 1) ing.certName = tlsSecretNames[0]
      }
    }
    if (['cluster', 'tlsPass'].includes(ing?.type as string)) {
      unset(ingressSchema, 'auth')
      unset(ingressSchema, 'forwardPath')
      unset(ingressSchema, 'path')
      unset(ingressSchema, 'hasCert')
    }
  }
  if (teamId !== 'admin') delete schema.properties.namespace

  return schema
}

export const getServiceUiSchema = (
  appsEnabled: Record<string, any>,
  formData: GetServiceApiResponse,
  user: GetSessionApiResponse['user'],
  teamId: string,
): any => {
  const ing = formData?.ingress as Record<string, any>
  // Since admin team does not obtain service list with dropdown we need to let a user to indicate of as service is knative
  const ksvcWidget = teamId === 'admin' ? undefined : 'hidden'
  const uiSchema: any = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    ksvc: { 'ui:widget': ksvcWidget },
    ingress: {
      domain: { 'ui:readonly': ing?.useDefaultSubdomain },
      subdomain: { 'ui:readonly': ing?.useDefaultSubdomain },
      // @ts-ignore
      certArn: { 'ui:readonly': formData?.ingress?.certSelect },
    },
  }
  // TODO: Not working yet, see bug: https://github.com/rjsf-team/react-jsonschema-form/issues/2776
  // So we remove the item from the schema instead (see getServiceSchema above)
  applyAclToUiSchema(uiSchema, user, teamId, 'service')

  return uiSchema
}

interface Props extends CrudProps {
  service?: GetServiceApiResponse
  k8sServices?: GetTeamK8SServicesApiResponse
  secrets: GetSecretsApiResponse
  teamId: string
}

function getSubdomain(serviceName: string | undefined, teamId): string {
  if (!serviceName) return ''
  if (teamId === 'admin') return serviceName
  return `${serviceName}.team-${teamId}`
}

export default function ({ service, k8sServices, secrets, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings, user } = useSession()
  const [data, setData] = useState<GetServiceApiResponse>(service)
  useEffect(() => {
    setData(service)
  }, [service])
  // END HOOKS
  // manipulate form data and set derived stuff:
  const formData = cloneDeep(data)
  const teamSubdomain = getSubdomain(formData?.name, teamId)
  const defaultSubdomain = teamSubdomain
  if (formData?.ingress) {
    let ing = formData.ingress as Record<string, any>
    if (
      !['cluster'].includes(ing.type as string) &&
      (!(data.ingress as Record<string, any>)?.domain || ing.useDefaultSubdomain)
    ) {
      // Set default domain and subdomain if ingress type not is 'cluster'
      ing = { ...ing }
      ing.subdomain = defaultSubdomain
      formData.ingress = ing
    }
    if (ing?.type === 'tlsPass') {
      // we don't expect some props when choosing tlsPass
      ing = { ...ing }
      unset(ing, 'hasCert')
      unset(ing, 'certArn')
      unset(ing, 'certName')
      unset(ing, 'forwardPath')
      formData.ingress = ing
    } else if (ing?.type === 'cluster') {
      // cluster has an empty ingress
      formData.ingress = { type: 'cluster' }
    }
  }
  // pass to the schema getters that manipulate the schemas based on form data
  const schema = getServiceSchema(appsEnabled, settings, formData, teamId, secrets, k8sServices)
  const uiSchema = getServiceUiSchema(appsEnabled, formData, user, teamId)
  return (
    <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Service' {...other} />
  )
}
