import { applyAclToUiSchema, getIngressSchemaPath, getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, isEmpty, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import {
  GetSecretsFromK8SApiResponse,
  GetServiceApiResponse,
  GetSessionApiResponse,
  GetSettingsInfoApiResponse,
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
  settings: GetSettingsInfoApiResponse,
  formData: GetServiceApiResponse,
): void => {
  const { cluster, dns } = settings
  // if (['cluster', 'tlsPass'].includes(formData?.ingress?.type)) return
  const ing = formData?.ingress as any
  // const idx = idxMap[formData?.ingress?.type]
  if (!formData || isEmpty(ing)) return
  const ingressSchemaPath = getIngressSchemaPath(1)
  const ingressSchema = getStrict(schema, ingressSchemaPath)
  const zones = [cluster.domainSuffix, ...(dns?.zones || [])]
  if (!ingressSchema) return
  if (ing.domain) {
    const { length } = ing.domain
    ingressSchema.subdomain.maxLength = 64 - length
  }
  // we only need to create an enum if we have more than one option
  if (ing.useDefaultHost && !ing.domain) ing.domain = zones[0]
  if (zones.length > 1) ingressSchema.domain.enum = zones
  else if (!ing.domain) ing.domain = zones[0]
}

export const addServiceNameEnumField = (
  schema: JSONSchema7,
  k8sServices: GetTeamK8SServicesApiResponse,
  formData: GetServiceApiResponse,
): void => {
  const k8sService = k8sServices?.filter((item) => item.name === formData?.name)
  if (k8sService?.length === 0 && formData?.name) return

  const k8sServiceNames = k8sServices?.map((item) => item.name)
  set(
    schema,
    'properties.name.enum',
    k8sServiceNames?.filter(
      (item: string) =>
        !item.includes('grafana') &&
        !item.includes('prometheus') &&
        !item.includes('alertmanager') &&
        !item.includes('tekton-dashboard'),
    ),
  )
  set(formData, 'ksvc.predeployed', false)
  if (formData && formData?.name) {
    set(schema, 'properties.port.enum', k8sService?.[0].ports)
    if (k8sService?.[0].managedByKnative) set(formData, 'ksvc.predeployed', true)
    unset(schema, 'properties.port.default')
  }
}

export const getServiceSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsInfoApiResponse,
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
  const idx = 1
  set(schema, 'properties.ingress.oneOf[1].allOf[0].properties.ingressClassName.enum', [
    'platform',
    ...settings.ingressClassNames,
  ])
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
    if (ing?.useCname) set(ingressSchema, `cname.required`, ['domain', 'tlsSecretName'])
    if (ing?.useCname && ing?.tlsPass) set(ingressSchema, `cname.required`, ['domain'])

    if (!ing?.hasCert) {
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    } else if (ing) {
      // Give the certName an enum selector with names of existing tls secrets
      if (ing.certSelect) {
        set(ingressSchema, `certName.enum`, secrets)
        set(ingressSchema, `certName.listNotShort`, true)
        if (secrets.length === 1) ing.certName = secrets[0]
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
  isKsvc = false,
): any => {
  const ing = formData?.ingress as Record<string, any>
  // Since admin team does not obtain service list with dropdown we need to let a user to indicate of as service is knative
  const ksvcWidget = teamId === 'admin' ? undefined : 'hidden'
  const cnameWidget = ing?.useCname
    ? { tlsSecretName: ing?.tlsPass && { 'ui:widget': 'hidden' } }
    : { 'ui:widget': 'hidden' }
  const uiSchema: any = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    ksvc: { 'ui:widget': ksvcWidget },
    ingress: {
      domain: { 'ui:readonly': ing?.useDefaultHost || isKsvc },
      subdomain: { 'ui:readonly': ing?.useDefaultHost || isKsvc },
      useDefaultHost: { 'ui:readonly': isKsvc },
      // @ts-ignore
      certArn: { 'ui:readonly': formData?.ingress?.certSelect },

      cname: cnameWidget,
    },
  }
  // TODO: Not working yet, see bug: https://github.com/rjsf-team/react-jsonschema-form/issues/2776
  // So we remove the item from the schema instead (see getServiceSchema above)
  applyAclToUiSchema(uiSchema, user, teamId, 'service')

  return uiSchema
}

export function getHost(serviceName: string | undefined, teamId: string, isKsvc = false): string {
  if (!serviceName) return ''
  if (isKsvc) return `${serviceName}-team-${teamId}`
  return `${serviceName}-${teamId}`
}

export const updateIngressField = (formData, defaultSubdomain, isKsvc = false) => {
  if (!formData?.ingress) return
  let ing = { ...formData.ingress } as Record<string, any>
  if (ing?.type !== 'cluster' && (!ing.domain || ing.useDefaultHost || isKsvc)) {
    // Set default domain and subdomain if ingress type not is 'cluster'
    ing.subdomain = defaultSubdomain
    if (isKsvc) ing.useDefaultHost = false
  }
  if (ing?.tlsPass) unset(ing, 'cname.tlsSecretName')
  if (ing?.type === 'tlsPass') {
    // we don't expect some props when choosing tlsPass
    unset(ing, 'hasCert')
    unset(ing, 'certArn')
    unset(ing, 'certName')
    unset(ing, 'forwardPath')
  } else if (ing?.type === 'cluster') {
    // cluster has an empty ingress
    ing = { type: 'cluster' }
  }
  formData.ingress = ing
}

interface Props extends CrudProps {
  service?: GetServiceApiResponse
  k8sServices?: GetTeamK8SServicesApiResponse
  secrets: GetSecretsFromK8SApiResponse
  teamId: string
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
  const isKsvc = formData?.ksvc?.predeployed
  const teamSubdomain = getHost(formData?.name, teamId, isKsvc)
  const defaultSubdomain = teamSubdomain
  updateIngressField(formData, defaultSubdomain, isKsvc)
  // pass to the schema getters that manipulate the schemas based on form data
  const schema = getServiceSchema(appsEnabled, settings, formData, teamId, secrets, k8sServices)
  const uiSchema = getServiceUiSchema(appsEnabled, formData, user, teamId, isKsvc)
  return (
    <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Service' {...other} />
  )
}
