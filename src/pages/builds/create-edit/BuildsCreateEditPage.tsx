import { Box, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { LandingHeader } from 'components/LandingHeader'
import { TextField } from 'components/forms/TextField'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useMemo, useState } from 'react'
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  CreateAplBuildApiArg,
  CreateAplBuildApiResponse,
  CreateAplCodeRepoApiResponse,
  useCreateAplBuildMutation,
  useDeleteAplBuildMutation,
  useEditAplBuildMutation,
  useGetAplBuildQuery,
  useGetRepoBranchesQuery,
  useGetTeamAplBuildsQuery,
  useGetTeamAplCodeReposQuery,
} from 'redux/otomiApi'
import { FieldPath, FormProvider, Resolver, useController, useForm } from 'react-hook-form'
import FormRow from 'components/forms/FormRow'
import DeleteButton from 'components/DeleteButton'
import Section from 'components/Section'
import ImgButtonGroup from 'components/ImgButtonGroup'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { Autocomplete } from 'components/forms/Autocomplete'
import { useSession } from 'providers/Session'
import InformationBanner from 'components/InformationBanner'
import MuiLink from 'components/MuiLink'
import useSettings from 'hooks/useSettings'
import { aplBuildApiSchema } from './create-edit-builds.validator'

const getBuildName = (name: string, tag: string): string => {
  return `${name}-${tag}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface Params {
  teamId: string
  buildName?: string
}

export default function BuildsCreateEditPage({
  match: {
    params: { teamId, buildName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()

  const [repoName, setRepoName] = useState('')
  const [gitService, setGitService] = useState('')

  const {
    settings: {
      cluster: { domainSuffix },
    },
    appsEnabled,
    user: { isPlatformAdmin },
  } = useSession()

  const { onToggleView } = useSettings()
  const history = useHistory()

  const appsMissing = !appsEnabled.tekton || !appsEnabled.harbor

  const handleAppsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    onToggleView()
    history.push('/apps/admin')
  }

  const bannerMessage = isPlatformAdmin ? (
    <>
      Container Images requires Tekton and Harbor to be enabled. Click{' '}
      <MuiLink href='/apps/admin' onClick={handleAppsClick}>
        here
      </MuiLink>{' '}
      to enable them.
    </>
  ) : (
    'Admin needs to enable the Tekton and Harbor app to activate this feature.'
  )

  const options = [
    {
      value: 'docker',
      label: 'Docker',
      imgSrc: '/logos/docker_logo.svg',
    },
    {
      value: 'buildpacks',
      label: 'BuildPacks',
      imgSrc: '/logos/buildpacks_logo.svg',
    },
  ]

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplBuildMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplBuildMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplBuildMutation()

  const {
    data: buildData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAplBuildQuery({ teamId, buildName }, { skip: !buildName })

  const { data: teamBuilds } = useGetTeamAplBuildsQuery({ teamId }, { skip: !teamId })

  const { data: codeRepos, isLoading: isLoadingCodeRepos } = useGetTeamAplCodeReposQuery({ teamId })

  const { data: repoBranches, isLoading: isLoadingRepoBranches } = useGetRepoBranchesQuery(
    { codeRepositoryName: repoName, teamId },
    { skip: !repoName },
  )

  const filteredCodeRepos = useMemo(
    () => (codeRepos || []).filter((cr) => appsEnabled?.gitea || cr?.spec?.gitService !== 'gitea'),
    [codeRepos, appsEnabled?.gitea],
  )

  const isDirty = useAppSelector((state) => state.global?.isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  const defaultValues = useMemo(() => {
    return aplBuildApiSchema.cast({
      kind: 'AplTeamBuild',
      metadata: {
        name: '',
        labels: {
          'apl.io/teamId': teamId,
        },
      },
      spec: {
        imageName: '',
        tag: '',
        mode: {
          type: 'docker',
          docker: {
            repoUrl: '',
            path: './Dockerfile',
            envVars: [],
          },
        },
        externalRepo: false,
        trigger: false,
        scanSource: false,
      },
      status: {
        conditions: [],
        phase: undefined,
      },
    }) as CreateAplBuildApiResponse
  }, [teamId])

  const buildNames = (teamBuilds ?? []).map((b) => b?.metadata?.name).filter(Boolean)

  const methods = useForm<CreateAplBuildApiResponse>({
    resolver: yupResolver(aplBuildApiSchema) as unknown as Resolver<CreateAplBuildApiResponse>,
    defaultValues: buildData ? (aplBuildApiSchema.cast(buildData) as CreateAplBuildApiResponse) : defaultValues,
    context: {
      buildNames,
      validateOnSubmit: !buildName,
    },
  })

  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    unregister,
  } = methods

  const modeType = watch('spec.mode.type')

  const { field: repoField } = useController<CreateAplBuildApiResponse>({
    control,
    name: `spec.mode.${modeType}.repoUrl` as FieldPath<CreateAplBuildApiResponse>,
  })

  const { field: revField } = useController<CreateAplBuildApiResponse>({
    control,
    name: `spec.mode.${modeType}.revision` as FieldPath<CreateAplBuildApiResponse>,
  })

  useEffect(() => {
    if (!buildData || isLoadingCodeRepos) return

    reset(buildData)

    const currentMode = watch('spec.mode.type')
    const repoUrl = watch(`spec.mode.${currentMode}.repoUrl`)
    const codeRepo = (codeRepos ?? []).find((cr) => cr?.spec?.repositoryUrl === repoUrl)

    setRepoName(codeRepo?.metadata?.name ?? '')
    setGitService(codeRepo?.spec?.gitService ?? '')
  }, [buildData, isLoadingCodeRepos, reset])

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete || isLoadingCodeRepos

  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/container-images`} />

  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/container-images/`} />

  const onSubmit = (formData: CreateAplBuildApiResponse) => {
    if (appsMissing) return

    const imageName = formData.spec?.imageName ?? ''
    const tag = formData.spec?.tag ?? ''

    const body: CreateAplBuildApiArg['body'] = {
      kind: 'AplTeamBuild',
      metadata: {
        name: buildName ? buildData?.metadata?.name ?? '' : getBuildName(imageName, tag),
      },
      spec: {
        imageName,
        tag,
        mode: formData.spec?.mode,
        externalRepo: formData.spec?.externalRepo,
        secretName: formData.spec?.secretName,
        trigger: formData.spec?.trigger,
        scanSource: formData.spec?.scanSource,
      },
    }

    if (buildName) update({ teamId, buildName, body })
    else create({ teamId, body })
  }

  const extraArgumentsError = () => {
    const envVarErrors = (errors as any)?.spec?.mode?.[`${watch('spec.mode.type')}`]?.envVars

    if (!envVarErrors) return undefined

    const idx = envVarErrors.findIndex((envVar: any) => envVar?.name?.message)

    if (idx === -1) return undefined

    const message = envVarErrors[idx]?.name?.message?.toString()

    return `Error in argument ${Number(idx) + 1}: ${message}`
  }

  if (isLoading || isError || (buildName && !watch('metadata.name')))
    return <PaperLayout loading title={t('TITLE_CONTAINER_IMAGE')} />

  const pathHelperText =
    watch('spec.mode.type') === 'docker'
      ? 'Relative path to the Dockerfile'
      : 'Relative path to the buildpacks directory'

  const fullRepositoryName = buildName
    ? `harbor.${domainSuffix}/team-${teamId}/${buildData?.spec?.imageName}:${buildData?.spec?.tag}`
    : `harbor.${domainSuffix}/team-${teamId}/${watch('spec.imageName') || '___'}:${watch('spec.tag') || '___'}`

  return (
    <Grid>
      <PaperLayout loading={isLoading} title={t('TITLE_CONTAINER_IMAGE', { buildName, role: 'team' })}>
        {appsMissing && <InformationBanner message={bannerMessage} />}

        <Box
          sx={{
            opacity: appsMissing ? 0.5 : 1,
            pointerEvents: appsMissing ? 'none' : 'auto',
            userSelect: appsMissing ? 'none' : 'auto',
          }}
        >
          <LandingHeader
            docsLabel='Docs'
            docsLink='https://techdocs.akamai.com/app-platform/docs/team-container-images'
            title={buildName ? buildData?.metadata?.name ?? '' : 'Create'}
            hideCrumbX={[0, 1]}
          />

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Section title='Build Task' description='Select how the source code should be built.'>
                <ImgButtonGroup
                  name='spec.mode.type'
                  control={control}
                  options={options}
                  value={watch('spec.mode.type')}
                  onChange={(selectedType) => {
                    const isDocker = selectedType === 'docker'
                    const previousType = isDocker ? 'buildpacks' : 'docker'

                    const nextMode = {
                      ...(watch(`spec.mode.${previousType}`) as any),
                      path: isDocker ? './Dockerfile' : '',
                    }

                    setValue(`spec.mode.${selectedType as 'docker' | 'buildpacks'}` as any, nextMode)
                    unregister(`spec.mode.${previousType}` as any)
                  }}
                />
              </Section>

              <Section
                title='Code Repository'
                description='Select the repository, reference and path used as the build source.'
              >
                <FormRow
                  spacing={10}
                  sx={{
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  <Autocomplete<CreateAplCodeRepoApiResponse, false, false, false>
                    label='Repository'
                    loading={isLoadingCodeRepos}
                    options={filteredCodeRepos}
                    getOptionLabel={(codeRepo) => codeRepo.metadata.name}
                    placeholder='Select a repository'
                    value={filteredCodeRepos.find((cr) => cr?.spec?.repositoryUrl === repoField.value) || null}
                    onChange={(_e, repo) => {
                      repoField.onChange(repo?.spec?.repositoryUrl ?? '')

                      if (!repo) return

                      const name = repo.metadata.name
                      const service = repo.spec.gitService
                      const isPrivate = repo.spec.private
                      const secret = repo.spec.secret

                      if (!buildName) setValue('spec.imageName', name)

                      setValue(`spec.mode.${modeType}.revision` as any, undefined as any)
                      setValue('spec.externalRepo', service !== 'gitea')

                      setRepoName(name)
                      setGitService(service)

                      if (isPrivate) setValue('spec.secretName', secret)
                      else unregister('spec.secretName')
                    }}
                    errorText={(errors as any)?.spec?.mode?.[modeType]?.repoUrl?.message?.toString()}
                    disabled={!!buildName || appsMissing}
                  />

                  <Autocomplete<string, false, false, false>
                    label='Reference'
                    loading={isLoadingRepoBranches}
                    options={repoBranches || []}
                    getOptionLabel={(repoBranch) => repoBranch}
                    placeholder='Select a reference'
                    value={(revField.value as string) ?? ''}
                    onChange={(_e, branch) => {
                      revField.onChange(branch ?? '')

                      if (!buildName) setValue('spec.tag', branch ?? '')
                    }}
                    errorText={(errors as any)?.spec?.mode?.[modeType]?.revision?.message?.toString()}
                    disabled={appsMissing}
                  />

                  <TextField
                    label='Path'
                    width='large'
                    {...register(`spec.mode.${watch('spec.mode.type')}.path` as any)}
                    onChange={(e) => setValue(`spec.mode.${watch('spec.mode.type')}.path` as any, e.target.value)}
                    error={!!(errors as any)?.spec?.mode?.[`${watch('spec.mode.type')}`]?.path}
                    helperText={
                      (errors as any)?.spec?.mode?.[`${watch('spec.mode.type')}`]?.path?.message?.toString() ||
                      pathHelperText
                    }
                    disabled={appsMissing}
                  />
                </FormRow>
              </Section>

              <Section
                title='Container Image'
                description='Configure the image name and tag that will be pushed to the internal registry.'
              >
                <FormRow
                  spacing={10}
                  sx={{
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  <TextField
                    label='Image name'
                    width='medium'
                    {...register('spec.imageName')}
                    value={watch('spec.imageName')}
                    onChange={(e) => setValue('spec.imageName', e.target.value)}
                    error={!!(errors as any)?.spec?.imageName}
                    helperText={(errors as any)?.spec?.imageName?.message?.toString()}
                    disabled={!!buildName || appsMissing}
                  />

                  <TextField
                    label='Tag'
                    width='medium'
                    {...register('spec.tag')}
                    onChange={(e) => setValue('spec.tag', e.target.value)}
                    error={!!(errors as any)?.spec?.tag}
                    helperText={(errors as any)?.spec?.tag?.message?.toString()}
                    disabled={!!buildName || appsMissing}
                  />
                </FormRow>

                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      color: 'text.secondary',
                    }}
                  >
                    Full repository name
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      color: 'text.primary',
                      wordBreak: 'break-all',
                    }}
                  >
                    {fullRepositoryName}
                  </Typography>
                </Box>
              </Section>

              <Section title='Extra Arguments' description='Additional arguments passed to the build executor.'>
                <KeyValue
                  keyLabel='Name'
                  valueLabel='Value'
                  addLabel='Add argument'
                  compressed
                  noMarginTop
                  name={`spec.mode.${watch('spec.mode.type')}.envVars`}
                  {...register(`spec.mode.${watch('spec.mode.type')}.envVars` as any)}
                  errorText={extraArgumentsError()}
                  isValueOptional
                />
              </Section>

              <Section title='Extra Options' description='Configure optional build behaviour.'>
                <Box>
                  {appsEnabled?.gitea && gitService === 'gitea' && (
                    <ControlledCheckbox
                      sx={{ my: 2 }}
                      name='spec.trigger'
                      control={control}
                      label='Create webhook listener'
                      explainertext='Select to trigger the build based on a repository webhook event'
                    />
                  )}

                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    name='spec.scanSource'
                    control={control}
                    label='Scan source code'
                    explainertext='Select to scan source code for vulnerabilities'
                  />
                </Box>
              </Section>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                {buildName && (
                  <DeleteButton
                    onDelete={() => del({ teamId, buildName })}
                    resourceName={watch('metadata.name')}
                    resourceType='build'
                    data-cy='button-delete-build'
                    loading={isLoadingDelete}
                    disabled={appsMissing || isLoadingDelete || isLoadingCreate || isLoadingUpdate}
                  />
                )}

                <LoadingButton
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={{ textTransform: 'none' }}
                  loading={isLoadingCreate || isLoadingUpdate}
                  disabled={appsMissing || isLoadingCreate || isLoadingUpdate || isLoadingDelete}
                >
                  {buildName ? 'Save Changes' : 'Create Container Image'}
                </LoadingButton>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </PaperLayout>
    </Grid>
  )
}
