import { GetAllAplWorkloadNamesApiResponse } from 'redux/otomiApi'

export interface PodLabelMatch {
  name: string
  value: string
}

interface WorkloadOption {
  name: string
  namespace: string
}

/**
 * Attempts to find a default pod label for the given workload.
 * @param workloadName The name of the workload (e.g. 'blue' or 'ksvc-hello-world')
 * @param podLabels A map of pod label keys to values fetched from the cluster.
 * @returns A PodLabelMatch with the selected label name and value, or null if none matched.
 */
export function getDefaultPodLabel(workloadName: string, podLabels: Record<string, string>): PodLabelMatch | null {
  if (!workloadName || !podLabels || typeof podLabels !== 'object') return null

  // 1. Exact match on app.kubernetes.io/instance
  const instanceKey = 'app.kubernetes.io/instance'
  const instanceValue = podLabels[instanceKey]
  if (instanceValue === workloadName) return { name: instanceKey, value: instanceValue }

  // 2. RabbitMQ component label: key must be 'app.kubernetes.io/component' and value 'rabbitmq'
  const componentKey = 'app.kubernetes.io/component'
  const componentValue = podLabels[componentKey]
  if (componentValue === 'rabbitmq') return { name: instanceKey, value: `${workloadName}-${componentValue}` }

  // 3. Knative serving label
  const knativeKey = Object.keys(podLabels).find((key) => key?.startsWith('serving.knative.dev/service'))
  if (knativeKey) return { name: knativeKey, value: podLabels[knativeKey] }

  // 4. cnpg cluster label
  const cnpgKey = Object.keys(podLabels).find((key) => key?.startsWith('cnpg.io/cluster'))
  if (cnpgKey) return { name: cnpgKey, value: podLabels[cnpgKey] }

  // 5. Istio canonical name for ksvc workloads
  const istioKey = 'service.istio.io/canonical-name'
  if (workloadName?.startsWith('ksvc-')) {
    const istioValue = podLabels[istioKey]
    if (istioValue === workloadName) return { name: istioKey, value: istioValue }
  }

  // No match found
  return null
}

function normalizeRabbitMQLabel(labelValue: string): string {
  return labelValue.replace(/-rabbitmq$/, '')
}

export function getInitialActiveWorkloadRow(
  labelValue: string,
  namespaceValue: string,
  workloads: GetAllAplWorkloadNamesApiResponse,
): WorkloadOption {
  if (!labelValue || !workloads || !Array.isArray(workloads)) return { name: 'unknown', namespace: '' }

  const normalizedLabel = normalizeRabbitMQLabel(labelValue)
  const matches = workloads.filter(
    (w) => w.metadata.name === normalizedLabel && w.metadata.namespace === namespaceValue,
  )

  if (matches.length > 1) return { name: 'multiple', namespace: '' }

  if (matches.length === 0) return { name: 'unknown', namespace: '' }

  return { name: matches[0].metadata.name, namespace: matches[0].metadata.namespace }
}

export function getInitialActiveWorkloadTarget(
  labelValue: string,
  workloads: GetAllAplWorkloadNamesApiResponse,
): string {
  if (!labelValue || !workloads || !Array.isArray(workloads)) return 'unknown'

  const normalizedLabel = normalizeRabbitMQLabel(labelValue)
  const matches = workloads.filter((w) => w.metadata.name === normalizedLabel)

  if (matches.length > 1) return 'multiple'

  if (matches.length === 0) return 'unknown'

  return matches[0].metadata.name
}
