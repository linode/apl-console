import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import YAML from 'yaml'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { makeStyles } from 'tss-react/mui'

import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import {
  CreateAplWorkloadApiArg,
  CreateAplWorkloadApiResponse,
  useCreateAplWorkloadMutation,
  useDeleteAplWorkloadMutation,
  useEditAplWorkloadMutation,
  useGetAplWorkloadQuery,
  useGetWorkloadCatalogMutation,
} from 'redux/otomiApi'
import DeleteButton from 'components/DeleteButton'
import { DocsLink } from 'components/DocsLink'
import ImgButtonGroup from 'components/ImgButtonGroup'
import { TextField } from 'components/forms/TextField'
import Section from 'components/Section'
import CodeEditor from './WorkloadsCodeEditor'
import { createAplWorkloadApiResponseSchema } from './create-edit-workloads.validator'

const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    width: '100%',
    left: 0,
    backgroundColor: theme.palette.background.default,
  },
  imgHolder: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    display: 'inline-flex',
  },
  img: {
    height: theme.spacing(6),
  },
}))

export const getDocsLink = (url: string, path: string): string => {
  if (process.env.NODE_ENV === 'development') return `${url.replace('.git', '')}/blob/main/${path}/README.md`
  return `${url.replace('.git', '')}/src/branch/main/${path}/README.md`
}

interface Params {
  teamId: string
  workloadName?: string
  catalogName?: string
}

export default function WorkloadsCreateEditPage({
  match: {
    params: { teamId, workloadName, catalogName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const { user } = useSession()
  const { isPlatformAdmin } = user
  const history = useHistory()
  const dispatch = useAppDispatch()
  const { classes } = useStyles()

  const {
    data: workload,
    isLoading: isLoadingWorkload,
    isFetching: isFetchingWorkload,
    isError: isErrorWorkload,
    refetch: refetchWorkload,
  } = useGetAplWorkloadQuery({ teamId, workloadName }, { skip: !workloadName })

  const [createWorkload, { isLoading: isCreating }] = useCreateAplWorkloadMutation()
  const [updateWorkload, { isLoading: isUpdating }] = useEditAplWorkloadMutation()
  const [deleteWorkload, { isLoading: isLoadingDWL, isSuccess: isSuccessDWL }] = useDeleteAplWorkloadMutation()

  const [getWorkloadCatalog, { isLoading: isLoadingCatalog }] = useGetWorkloadCatalogMutation()
  const [catalogItem, setCatalogItem] = useState<any>({})

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  // Normalise spec.values from the new GET to always be a string in the form
  let normalisedValues = ''
  const rawValues = workload?.spec?.values

  if (typeof rawValues === 'string') normalisedValues = rawValues
  else if (rawValues) normalisedValues = JSON.stringify(rawValues, null, 2)

  const mergedDefaultValues = createAplWorkloadApiResponseSchema.cast({
    ...workload,
    kind: workload?.kind ?? 'AplTeamWorkload',
    metadata: {
      ...workload?.metadata,
      name: workload?.metadata?.name ?? '',
      labels: {
        ...workload?.metadata?.labels,
        'apl.io/teamId': workload?.metadata?.labels?.['apl.io/teamId'] ?? teamId,
      },
    },
    spec: {
      ...workload?.spec,
      url: workload?.spec?.url ?? '',
      chartProvider: workload?.spec?.chartProvider ?? 'helm',
      imageUpdateStrategy: workload?.spec?.imageUpdateStrategy ?? { type: 'disabled' },
      values: normalisedValues,
    },
  }) as CreateAplWorkloadApiResponse

  const methods = useForm<CreateAplWorkloadApiResponse>({
    disabled: !isPlatformAdmin,
    resolver: yupResolver(createAplWorkloadApiResponseSchema) as Resolver<CreateAplWorkloadApiResponse>,
    defaultValues: mergedDefaultValues,
  })

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods

  // Fetch catalog info only when creating (no workloadName)
  useEffect(() => {
    if (workloadName) return

    getWorkloadCatalog({ body: { url: '', sub: user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      const item = catalog.find((item) => item.name === catalogName)
      if (!item) return

      const {
        chartVersion: helmChartVersion,
        chartDescription: helmChartDescription,
        name: path,
        values,
        valuesSchema,
        icon,
      } = item
      const chartMetadata = { helmChartVersion, helmChartDescription }
      setCatalogItem({ chartMetadata, path, values, valuesSchema, url, icon })
    })
  }, [workload])

  // When editing, use workload from API; when creating, use catalog item
  const workloadData = workloadName ? workload : catalogItem
  const valuesData = workloadName ? workload?.spec?.values : catalogItem?.values
  const valuesSchema = catalogItem?.valuesSchema

  const [workloadValuesYaml, setWorkloadValuesYaml] = useState(
    typeof valuesData === 'string' ? valuesData : YAML.stringify(valuesData ?? {}),
  )

  useEffect(() => {
    setWorkloadValuesYaml(typeof valuesData === 'string' ? valuesData : YAML.stringify(valuesData ?? {}))
  }, [workloadData, valuesData])

  // Refetch workload when dirty flag resets (edit mode only)
  useEffect(() => {
    if (isDirty !== false) return
    if (!workloadName) return
    if (!isFetchingWorkload) refetchWorkload()
  }, [isDirty, workloadName, isFetchingWorkload, refetchWorkload])

  const mutating = isLoadingDWL || isCreating || isUpdating
  if (!mutating && isSuccessDWL) return <Redirect to={`/teams/${teamId}/workloads`} />

  const icon = workloadData?.icon || '/logos/akamai_logo.svg'

  // ---- Auto image updater state ----
  type AutoUpdaterType = 'disabled' | 'digest' | 'semver'
  const watchedStrategyType = watch('spec.imageUpdateStrategy.type') as AutoUpdaterType | undefined
  const [autoUpdaterType, setAutoUpdaterType] = useState<AutoUpdaterType>('disabled')

  // initialise local state from form values
  useEffect(() => {
    if (watchedStrategyType) setAutoUpdaterType(watchedStrategyType)
  }, [watchedStrategyType])

  const autoImageUpdaterOptions = [
    {
      value: 'disabled',
      label: 'Disabled',
      caption: '',
    },
    {
      value: 'digest',
      label: 'Digest',
      caption: 'Latest, feat, dev',
    },
    {
      value: 'semver',
      label: 'Semver',
      caption: '1.x.x',
    },
  ]

  const handleAutoUpdaterChange = (value: string) => {
    const selected = value as AutoUpdaterType
    setAutoUpdaterType(selected)

    if (selected === 'disabled') setValue('spec.imageUpdateStrategy', { type: 'disabled' } as any)
    else if (selected === 'digest') {
      // keep existing digest block if present
      const currentDigest = watch('spec.imageUpdateStrategy.digest') ?? {}
      setValue('spec.imageUpdateStrategy', {
        type: 'digest',
        digest: currentDigest,
      } as any)
    } else if (selected === 'semver') {
      const currentSemver = watch('spec.imageUpdateStrategy.semver') ?? {}
      setValue('spec.imageUpdateStrategy', {
        type: 'semver',
        semver: currentSemver,
      } as any)
    }
  }

  const onSubmit = async (formData: CreateAplWorkloadApiResponse) => {
    const workloadBody = omit(formData.spec, ['chartProvider', 'chart', 'revision'])
    const chartMetadata = omit(formData.spec?.chartMetadata, ['helmChartCatalog', 'helmChart'])
    const path = workloadData?.path ?? (formData as any).path
    const url = workloadData?.url ?? (formData as any).url ?? ''

    // ---- derive imageUpdateStrategy from values.yaml if needed ----
    let imageUpdateStrategy = formData.spec.imageUpdateStrategy

    try {
      const parsedValues = YAML.parse(workloadValuesYaml || '')
      const imageRepository: string | undefined = parsedValues?.image?.repository
      const tag: string | undefined = parsedValues?.image?.tag

      const selectedType = (imageUpdateStrategy as any)?.type as 'disabled' | 'digest' | 'semver' | undefined

      if (imageRepository && selectedType === 'digest') {
        const currentDigest = (imageUpdateStrategy as any)?.digest ?? {}
        imageUpdateStrategy = {
          type: 'digest',
          digest: {
            imageRepository,
            tag: tag ?? currentDigest.tag ?? '',
            imageParameter: currentDigest.imageParameter,
            tagParameter: currentDigest.tagParameter,
          },
        }
      }

      if (imageRepository && selectedType === 'semver') {
        const currentSemver = (imageUpdateStrategy as any)?.semver ?? {}
        imageUpdateStrategy = {
          type: 'semver',
          semver: {
            imageRepository,
            versionConstraint: currentSemver.versionConstraint ?? '',
            imageParameter: currentSemver.imageParameter,
            tagParameter: currentSemver.tagParameter,
          },
        }
      }
    } catch {
      // if YAML is invalid we just don't override imageUpdateStrategy
    }

    const body: CreateAplWorkloadApiArg['body'] = {
      kind: 'AplTeamWorkload',
      metadata: {
        name: workloadName ?? formData.metadata?.name ?? '',
        // add labels here if the backend expects them on create/update
        // labels: { 'apl.io/teamId': teamId },
      },
      spec: {
        ...workloadBody,
        chartMetadata,
        url,
        path,
        values: workloadValuesYaml,
        imageUpdateStrategy,
      },
    }

    let res
    if (workloadName) {
      dispatch(setError(undefined))
      res = await updateWorkload({ teamId, workloadName, body })
    } else res = await createWorkload({ teamId, body })

    if (!('error' in res && res.error)) history.push(`/teams/${teamId}/workloads`)
  }

  if (isLoadingWorkload || isLoadingCatalog) return <PaperLayout loading title={t('TITLE_SERVICE')} />

  return (
    <PaperLayout title={t('TITLE_WORKLOAD', { workloadName, role: 'team' })}>
      {isErrorWorkload ? null : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ width: '100%' }}>
              <Box className={classes.header}>
                <Box className={classes.imgHolder}>
                  <img
                    className={classes.img}
                    src={icon}
                    onError={({ currentTarget }) => {
                      // eslint-disable-next-line no-param-reassign
                      currentTarget.onerror = null
                      // eslint-disable-next-line no-param-reassign
                      currentTarget.src = `${icon}`
                    }}
                    alt={`Logo for ${icon}`}
                  />
                </Box>
                <Box>
                  <Typography variant='h6'>
                    {workloadData?.name ? `${workloadData.name} (${workloadData.path})` : workloadData?.path}
                  </Typography>
                </Box>
                {workloadData?.url && workloadData?.path && (
                  <Box sx={{ ml: 'auto' }}>
                    <DocsLink href={getDocsLink(workloadData.url as string, workloadData.path as string)} />
                  </Box>
                )}
              </Box>

              <Section>
                <TextField
                  label='Workload name'
                  width='large'
                  noMarginTop
                  value={watch('metadata.name') || ''}
                  onChange={(e) => setValue('metadata.name', e.target.value)}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!workloadName || !isPlatformAdmin}
                />
              </Section>

              {/* Auto image updater */}
              <Section
                title='Auto Image Updater'
                description='Automatically update the image. Only supported when the image is stored in Harbor.'
              >
                <ImgButtonGroup
                  name='spec.imageUpdateStrategy.type'
                  control={methods.control}
                  options={autoImageUpdaterOptions}
                  value={autoUpdaterType}
                  onChange={handleAutoUpdaterChange}
                />
                {autoUpdaterType === 'digest' && (
                  <Box sx={{ mt: 3, maxWidth: 480 }}>
                    <TextField
                      label='Version'
                      width='large'
                      noMarginTop
                      placeholder='latest, feat, dev'
                      {...methods.register('spec.imageUpdateStrategy.digest.tag' as const)}
                    />
                  </Box>
                )}
                {autoUpdaterType === 'semver' && (
                  <Box sx={{ mt: 3, maxWidth: 480 }}>
                    <TextField
                      label='Version'
                      width='large'
                      noMarginTop
                      placeholder='1.x.x'
                      {...methods.register('spec.imageUpdateStrategy.semver.versionConstraint' as const)}
                    />
                  </Box>
                )}
                {/* {autoUpdaterType === 'disabled' && (
                  <Box sx={{ mt: 3, maxWidth: 480 }}>
                    <TextField label='Version' width='large' noMarginTop placeholder='latest, feat, dev' disabled />
                  </Box>
                )} */}
              </Section>

              {/* Values editor */}
              <CodeEditor code={workloadValuesYaml} onChange={setWorkloadValuesYaml} validationSchema={valuesSchema} />

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', float: 'right', mt: 2 }}>
                <ButtonGroup sx={{ gap: '10px' }}>
                  <Button variant='contained' type='submit' disabled={mutating || !isPlatformAdmin}>
                    Submit
                  </Button>
                  {workloadName && (
                    <DeleteButton
                      onDelete={() => deleteWorkload({ teamId, workloadName })}
                      resourceName={workloadData?.name}
                      resourceType='workload'
                      data-cy='button-delete-workload'
                      disabled={mutating || !isPlatformAdmin}
                    />
                  )}
                </ButtonGroup>
              </Box>
            </Box>
          </form>
        </FormProvider>
      )}
    </PaperLayout>
  )
}
