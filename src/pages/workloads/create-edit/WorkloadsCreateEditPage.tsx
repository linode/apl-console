import { Box, ButtonGroup } from '@mui/material'
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
import ImgButtonGroup from 'components/ImgButtonGroup'
import { TextField } from 'components/forms/TextField'
import Section from 'components/Section'
import { LoadingButton } from '@mui/lab'
import { LandingHeader } from 'components/LandingHeader'
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

  const [createWorkload, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplWorkloadMutation()
  const [updateWorkload, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplWorkloadMutation()
  const [deleteWorkload, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplWorkloadMutation()

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
    reset,
    formState: { errors },
  } = methods

  // Fetch catalog info only when creating (no workloadName)
  useEffect(() => {
    if (workloadName) reset(mergedDefaultValues)

    getWorkloadCatalog({ body: { url: '', sub: user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      let item = null

      if (workload?.spec?.path) item = catalog.find((c) => c.name === workload.spec.path)
      else if (catalogName) item = catalog.find((c) => c.name === catalogName)

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

  const icon = workloadData?.spec?.icon || catalogItem.icon || '/logos/akamai_logo.svg'
  const headerName = workloadData?.metadata?.name || catalogItem.name
  const headerPath = workloadData?.spec?.path || catalogItem.path || 'custom'

  // ---- Auto image updater state ----
  type AutoUpdaterType = 'disabled' | 'digest' | 'semver'
  const watchedStrategyType = watch('spec.imageUpdateStrategy.type') as AutoUpdaterType | undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
      caption: '1.x.x, ^1.0.2, ~1.0.2',
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
    const path = workloadData?.spec?.path ?? workloadData.path ?? (formData as any).path
    const url = workloadData?.spec?.url ?? workloadData.url ?? (formData as any).url ?? ''

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

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/workloads`} />

  if (isLoadingWorkload || isLoadingCatalog) return <PaperLayout loading title={t('TITLE_WORKLOAD')} />

  return (
    <PaperLayout title={t('TITLE_WORKLOAD', { workloadName, role: 'team' })}>
      <Box className={classes.header} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box className={classes.imgHolder} sx={{ flex: '0 0 auto' }}>
          <img
            className={classes.img}
            src={icon}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = `${icon}`
            }}
            alt={`Logo for ${icon}`}
          />
        </Box>

        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          <LandingHeader
            title={headerName && headerPath ? `${headerName} (${headerPath})` : headerName ?? headerPath}
            docsLabel='Docs'
            docsLink={
              workloadData?.spec?.url && workloadData?.spec?.path
                ? getDocsLink(workloadData.spec.url as string, workloadData.spec.path as string)
                : undefined
            }
            hideCrumbX={workloadName ? [1, 2] : undefined}
            breadcrumbOverrides={[
              {
                position: 1,
                label: 'Workloads',
                linkTo: `/teams/${teamId}/workloads`,
              },
              {
                position: 2,
                label: 'Catalogs',
                linkTo: `/catalogs/${teamId}`,
              },
            ]}
          />
        </Box>
      </Box>
      {isErrorWorkload ? null : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ width: '100%' }}>
              <Section>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
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
                  {isPlatformAdmin && teamId === 'admin' && (
                    <TextField
                      label='Namespace'
                      width='large'
                      noMarginTop
                      value={watch('spec.namespace') || ''}
                      onChange={(e) => setValue('spec.namespace', e.target.value)}
                      error={!!errors.spec?.namespace}
                      helperText={errors.spec?.message?.toString()}
                    />
                  )}
                </Box>
              </Section>

              {/* Auto image updater */}
              <Section
                title='Auto Image Updater'
                description='Automatically update the image. Only supported when the image is stored in Harbor. Image tag and repository can be set in the editor'
              >
                <ImgButtonGroup
                  name='spec.imageUpdateStrategy.type'
                  control={methods.control}
                  options={autoImageUpdaterOptions}
                  value={autoUpdaterType}
                  onChange={handleAutoUpdaterChange}
                />
                {autoUpdaterType === 'semver' && (
                  <Box sx={{ mt: 3, maxWidth: 480 }}>
                    <TextField
                      label='Version constraint'
                      width='large'
                      noMarginTop
                      placeholder='1.x.x'
                      error={!!(errors.spec?.imageUpdateStrategy as any)?.semver?.versionConstraint}
                      helperText={(
                        errors.spec?.imageUpdateStrategy as any
                      )?.semver?.versionConstraint?.message?.toString()}
                      {...methods.register('spec.imageUpdateStrategy.semver.versionConstraint' as const)}
                    />
                  </Box>
                )}
              </Section>

              {/* Values editor */}
              <CodeEditor code={workloadValuesYaml} onChange={setWorkloadValuesYaml} validationSchema={valuesSchema} />

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', float: 'right', mt: 2 }}>
                <ButtonGroup sx={{ gap: '10px' }}>
                  <LoadingButton variant='contained' type='submit' loading={mutating} disabled={mutating}>
                    {workloadName ? 'Save Changes' : 'Create Workload'}
                  </LoadingButton>
                  {workloadName && (
                    <DeleteButton
                      onDelete={() => deleteWorkload({ teamId, workloadName })}
                      resourceName={workloadData?.metadata?.name}
                      resourceType='workload'
                      data-cy='button-delete-workload'
                      loading={isLoadingDelete}
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
