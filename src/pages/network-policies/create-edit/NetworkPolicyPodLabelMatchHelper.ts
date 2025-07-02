export interface PodLabelMatch {
  name: string
  value: string
}

/**
 * Attempts to find a default pod label for the given workload.
 * @param workloadName The name of the workload (e.g. 'blue' or 'ksvc-hello-world')
 * @param podLabels A map of pod label keys to values fetched from the cluster.
 * @returns A PodLabelMatch with the selected label name and value, or null if none matched.
 */
export function getDefaultPodLabel(workloadName: string, podLabels: Record<string, string>): PodLabelMatch | null {
  // 1. Exact match on app.kubernetes.io/instance
  const instanceKey = 'app.kubernetes.io/instance'
  const instanceValue = podLabels[instanceKey]
  if (instanceValue && instanceValue === workloadName) return { name: instanceKey, value: instanceValue }

  // 2. For ksvc workloads, match service.istio.io/canonical-name
  //    e.g. workloadName 'ksvc-hello-world'
  if (workloadName.startsWith('ksvc-')) {
    const istioKey = 'service.istio.io/canonical-name'
    const istioValue = podLabels[istioKey]
    if (istioValue && istioValue === workloadName) return { name: istioKey, value: istioValue }
  }

  // Add other matchers here as needed

  return null
}
