import { Box, Grid, Typography, useTheme } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useMemo, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
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
import { LandingHeader } from 'components/LandingHeader'
import { FieldPath, FormProvider, Resolver, useController, useForm } from 'react-hook-form'
import FormRow from 'components/forms/FormRow'
import DeleteButton from 'components/DeleteButton'
import { yupResolver } from '@hookform/resolvers/yup'
import Section from 'components/Section'
import ImgButtonGroup from 'components/ImgButtonGroup'
import { Divider } from 'components/Divider'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { Autocomplete } from 'components/forms/Autocomplete'
import { useSession } from 'providers/Session'
import { LoadingButton } from '@mui/lab'
import { aplBuildApiSchema } from './create-edit-builds.validator'

const getBuildName = (name: string, tag: string): string => {
  return `${name}-${tag}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/gi, '-') // Replace invalid characters with hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, '') // Remove leading or trailing hyphens
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
  const theme = useTheme()

  const [repoName, setRepoName] = useState('')
  const [gitService, setGitService] = useState('')

  const {
    settings: {
      cluster: { domainSuffix },
    },
    appsEnabled,
  } = useSession()

  const options = [
    { value: 'docker', label: 'Docker', imgSrc: '/logos/docker_logo.svg' },
    { value: 'buildpacks', label: 'BuildPacks', imgSrc: '/logos/buildpacks_logo.svg' },
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
    { codeRepoName: repoName, teamId },
    { skip: !repoName },
  )

  const filteredCodeRepos = useMemo(
    () => (codeRepos || []).filter((cr) => appsEnabled?.gitea || cr?.spec?.gitService !== 'gitea'),
    [codeRepos, appsEnabled?.gitea],
  )

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  const defaultValues = useMemo(() => {
    return aplBuildApiSchema.cast({
      kind: 'AplTeamBuild',
      metadata: {
        name: '',
        labels: { 'apl.io/teamId': teamId },
      },
      spec: {
        imageName: '',
        tag: '',
        mode: { type: 'docker', docker: { repoUrl: '', path: './Dockerfile', envVars: [] } },
        externalRepo: false,
        trigger: false,
        scanSource: false,
      },
      status: { conditions: [], phase: undefined },
    }) as CreateAplBuildApiResponse
  }, [teamId])

  const buildNames = (teamBuilds ?? []).map((b) => b?.metadata?.name).filter(Boolean)

  const methods = useForm<CreateAplBuildApiResponse>({
    resolver: yupResolver(aplBuildApiSchema) as unknown as Resolver<CreateAplBuildApiResponse>,
    defaultValues: buildData ? (aplBuildApiSchema.cast(buildData) as CreateAplBuildApiResponse) : defaultValues,
    context: { buildNames, validateOnSubmit: !buildName },
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

  return (
    <Grid>
      <PaperLayout loading={isLoading} title={t('TITLE_CONTAINER_IMAGE', { buildName, role: 'team' })}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-container-images'
          title={buildName ? buildData?.metadata?.name ?? '' : 'Create'}
          hideCrumbX={[0, 1]}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <Typography variant='h6'>Select build task</Typography>

              <FormRow spacing={10} sx={{ my: 2 }}>
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
              </FormRow>

              <Typography variant='h6'>Select code repository</Typography>

              <FormRow spacing={10} sx={{ alignItems: 'flex-start' }}>
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
                    const gitService = repo.spec.gitService
                    const isPrivate = repo.spec.private
                    const secret = repo.spec.secret

                    if (!buildName) setValue('spec.imageName', name)
                    setValue(`spec.mode.${modeType}.revision` as any, undefined as any)

                    setValue('spec.externalRepo', gitService !== 'gitea')
                    setRepoName(name)
                    setGitService(gitService)

                    if (isPrivate) setValue('spec.secretName', secret)
                    else unregister('spec.secretName')
                  }}
                  errorText={(errors as any)?.spec?.mode?.[modeType]?.repoUrl?.message?.toString()}
                  disabled={!!buildName}
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
                />
              </FormRow>

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Typography variant='h6'>Image name and tag</Typography>

              <FormRow spacing={10} sx={{ mb: 2, alignItems: 'flex-start' }}>
                <TextField
                  label='Image name'
                  width='medium'
                  {...register('spec.imageName')}
                  value={watch('spec.imageName')}
                  onChange={(e) => setValue('spec.imageName', e.target.value)}
                  error={!!(errors as any)?.spec?.imageName}
                  helperText={(errors as any)?.spec?.imageName?.message?.toString()}
                  disabled={!!buildName}
                />

                <TextField
                  label='Tag'
                  width='medium'
                  {...register('spec.tag')}
                  onChange={(e) => setValue('spec.tag', e.target.value)}
                  error={!!(errors as any)?.spec?.tag}
                  helperText={(errors as any)?.spec?.tag?.message?.toString()}
                  disabled={!!buildName}
                />
              </FormRow>

              <Typography
                variant='body1'
                sx={{ display: 'inline-block', fontSize: 16, fontWeight: 400, color: theme.palette.cl.text.subTitle }}
              >
                {buildName
                  ? `Full repository name: harbor.${domainSuffix}/team-${teamId}/${buildData?.spec?.imageName}:${buildData?.spec?.tag}`
                  : `Full repository name: harbor.${domainSuffix}/team-${teamId}/${watch('spec.imageName') || '___'}:${
                      watch('spec.tag') || '___'
                    }`}
              </Typography>

              <Divider sx={{ mt: 2, mb: 2 }} />

              <KeyValue
                title='Extra arguments'
                subTitle='Additional arguments to pass on to the build executor'
                keyLabel='Name'
                valueLabel='Value'
                addLabel='Add argument'
                compressed
                name={`spec.mode.${watch('spec.mode.type')}.envVars`}
                {...register(`spec.mode.${watch('spec.mode.type')}.envVars` as any)}
                errorText={extraArgumentsError()}
                isValueOptional
              />

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Typography variant='h6'>Extra options</Typography>

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

            {buildName && (
              <DeleteButton
                onDelete={() => del({ teamId, buildName })}
                resourceName={watch('metadata.name')}
                resourceType='build'
                data-cy='button-delete-build'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
                loading={isLoadingDelete}
                disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
              />
            )}

            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              sx={{ float: 'right', textTransform: 'none' }}
              loading={isLoadingCreate || isLoadingUpdate}
              disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete}
            >
              {buildName ? 'Save Changes' : 'Create Container Image'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
