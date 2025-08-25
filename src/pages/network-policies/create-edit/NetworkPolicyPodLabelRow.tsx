import { FieldPath, useController, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { GetAllAplWorkloadNamesApiResponse, useGetK8SWorkloadPodLabelsQuery } from 'redux/otomiApi'
import { getDefaultPodLabel, getInitialActiveWorkloadRow } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: GetAllAplWorkloadNamesApiResponse
  teamId: string
  fieldArrayName: FieldPath<FormValues>
  rowIndex?: number
  showBanner?: () => void
}

interface PodLabelMatch {
  fromNamespace: string
  fromLabelName: string
  fromLabelValue?: string
}

interface WorkloadOption {
  name: string
  namespace: string
}

interface FormValues {
  ruleType: {
    ingress: {
      allow: PodLabelMatch[]
    }
  }
  [key: string]: any
}

export default function NetworkPolicyPodLabelRow({
  aplWorkloads,
  teamId,
  fieldArrayName,
  rowIndex,
  showBanner,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>()
  const { field } = useController<FormValues>({ control, name: fieldArrayName })

  const [activeWorkload, setActiveWorkload] = useState<WorkloadOption | null>(null)
  const [circuitBreaker, setCircuitBreaker] = useState<boolean>(true)

  const arrayError = (errors.ruleType?.ingress?.allow?.root as any)?.message as string | undefined

  // build and sort workload options
  const workloadOptions = useMemo(
    () =>
      aplWorkloads
        .map((w) => ({ name: w.metadata.name, namespace: w.metadata.namespace }))
        .sort((a, b) => a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name)),
    [aplWorkloads],
  )

  // fetch pod‐labels & pod-names
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    {
      teamId,
      workloadName: activeWorkload?.name ?? '',
      namespace: activeWorkload?.namespace ?? '',
    },
    { skip: !activeWorkload },
  )

  // Initial edit-mode circuitbreaker, prevent prepopulated fields from starting a rerender loop
  useEffect(() => {
    const { fromLabelValue, fromNamespace } = field.value as PodLabelMatch
    if (fromLabelValue) {
      const initialActiveWorkload = getInitialActiveWorkloadRow(fromLabelValue, fromNamespace, aplWorkloads)
      if (initialActiveWorkload.name === 'unknown' || initialActiveWorkload.name === 'multiple') showBanner?.()
      setActiveWorkload(initialActiveWorkload)
    } else setCircuitBreaker(false)
  }, [])

  // clear label when workload manually selected
  useEffect(() => {
    if (circuitBreaker || !activeWorkload) return
    field.onChange({ fromNamespace: '', fromLabelName: '', fromLabelValue: undefined })
  }, [activeWorkload])

  // default match on create
  useEffect(() => {
    if (podLabels && circuitBreaker) setCircuitBreaker(false)
    if (!activeWorkload || !podLabels) return
    const currentValue = field.value as PodLabelMatch
    if (currentValue?.fromLabelName && currentValue?.fromLabelValue) return
    const match = getDefaultPodLabel(activeWorkload.name, podLabels as Record<string, string>)
    if (match) {
      field.onChange({
        fromNamespace: activeWorkload.namespace,
        fromLabelName: match.name,
        fromLabelValue: match.value,
      })
    }
  }, [activeWorkload, podLabels])

  return (
    <FormRow spacing={10}>
      <Autocomplete<WorkloadOption, false, false, false>
        label='Workload'
        hideLabel={rowIndex !== 0}
        width='large'
        multiple={false}
        options={workloadOptions}
        groupBy={(opt) => opt.namespace}
        getOptionLabel={(opt) => opt.name}
        value={activeWorkload}
        onChange={(_e, opt) => setActiveWorkload(opt ? { name: opt?.name, namespace: opt?.namespace } : null)}
      />

      <Autocomplete
        hideLabel={rowIndex !== 0}
        label='Pod Label(s)'
        width='large'
        multiple={false}
        errorText={arrayError && rowIndex === 0 ? arrayError : ''}
        helperText={arrayError && rowIndex === 0 ? arrayError : ''}
        options={
          podLabels && typeof podLabels === 'object'
            ? Object.entries(podLabels as Record<string, string>).map(([k, v]) => `${k}=${v}`)
            : []
        }
        value={field.value?.fromLabelName ? `${field.value.fromLabelName}=${field.value.fromLabelValue ?? ''}` : null}
        onChange={(_e, raw: string | null) => {
          const [name, value] = raw?.split('=', 2) ?? []
          field.onChange({ fromNamespace: activeWorkload?.namespace, fromLabelName: name, fromLabelValue: value })
        }}
      />
    </FormRow>
  )
}
