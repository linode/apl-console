import { Box, Grid, Typography, useTheme } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  CreateBuildApiResponse,
  GetCodeRepoApiResponse,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useEditBuildMutation,
  useGetBuildQuery,
  useGetRepoBranchesQuery,
  useGetTeamBuildsQuery,
  useGetTeamCodeReposQuery,
} from 'redux/otomiApi'
import { cloneDeep } from 'lodash'
import { LandingHeader } from 'components/LandingHeader'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
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
import { buildApiResponseSchema } from './create-edit.validator'

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

export default function CreateEditBuilds({
  match: {
    params: { teamId, buildName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const theme = useTheme()
  const [data, setData]: any = useState()
  const [repoName, setRepoName] = useState('')
  const [gitService, setGitService] = useState('')

  const {
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()

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

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateBuildMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditBuildMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteBuildMutation()
  const {
    data: buildData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBuildQuery({ teamId, buildName }, { skip: !buildName })
  const { data: teamBuilds } = useGetTeamBuildsQuery({ teamId }, { skip: !teamId })
  const { data: codeRepos, isLoading: isLoadingCodeRepos } = useGetTeamCodeReposQuery({ teamId })
  const { data: repoBranches, isLoading: isLoadingRepoBranches } = useGetRepoBranchesQuery(
    { codeRepoName: repoName, teamId },
    { skip: !repoName },
  )

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  useEffect(() => {
    if (buildName) setData(buildData)
  }, [buildData, buildName])
  // END HOOKS

  // form state
  const defaultValues = {
    mode: { type: 'docker', docker: { path: './Dockerfile', envVars: [] } },
    externalRepo: false,
  }
  const methods = useForm<CreateBuildApiResponse>({
    resolver: yupResolver(buildApiResponseSchema) as Resolver<any>,
    defaultValues: data || defaultValues,
    context: { buildNames: teamBuilds?.map((build) => build.name), validateOnSubmit: !buildName },
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

  useEffect(() => {
    if (!buildData || isLoadingCodeRepos) return
    reset(buildData)
    const modeType = watch('mode.type')
    const repoUrl = watch(`mode.${modeType}.repoUrl`)
    const codeRepo = codeRepos?.find((codeRepo) => codeRepo.repositoryUrl === repoUrl)
    setRepoName(codeRepo?.name || '')
    setGitService(codeRepo?.gitService || '')
  }, [buildData, isLoadingCodeRepos, setValue])

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete || isLoadingCodeRepos
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/container-images`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/container-images/`} />

  const onSubmit = () => {
    const body = cloneDeep(watch())
    if (buildName) {
      body.name = buildData.name
      update({ teamId, buildName, body })
    } else {
      body.name = getBuildName(body.imageName, body.tag)
      create({ teamId, body })
    }
  }

  if (isLoading || isError || (buildName && !watch('name')))
    return <PaperLayout loading title={t('TITLE_CONTAINER_IMAGE')} />

  const pathHelperText =
    watch('mode.type') === 'docker' ? 'Relative path to the Dockerfile' : 'Relative path to the buildpacks directory'

  return (
    <Grid>
      <PaperLayout loading={isLoading} title={t('TITLE_CONTAINER_IMAGE', { buildName, role: 'team' })}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/for-devs/console/container-images'
          title={buildName ? buildData.name : 'Create'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <Typography variant='h6'>Select build task</Typography>
              <FormRow spacing={10} sx={{ my: 2 }}>
                <ImgButtonGroup
                  name='mode.type'
                  control={control}
                  options={options}
                  value={watch('mode.type')}
                  onChange={(selectedType) => {
                    const isDocker = selectedType === 'docker'
                    const previousType = isDocker ? 'buildpacks' : 'docker'
                    const nextMode = {
                      ...watch(`mode.${previousType}`),
                      path: isDocker ? './Dockerfile' : '',
                    }

                    setValue(`mode.${selectedType as 'docker' | 'buildpacks'}`, nextMode)
                    unregister(`mode.${previousType}`)
                  }}
                />
              </FormRow>

              <Typography variant='h6'>Select code repository</Typography>
              <FormRow spacing={10} sx={{ alignItems: 'flex-start' }}>
                <Autocomplete
                  label='Repository'
                  loading={isLoadingCodeRepos}
                  options={(codeRepos || []).map((codeRepo) => {
                    return { label: codeRepo.name, codeRepo }
                  })}
                  placeholder='Select a repository'
                  {...register(`mode.${watch('mode.type')}.repoUrl`)}
                  value={
                    codeRepos?.find(
                      (codeRepo) => codeRepo.repositoryUrl === watch(`mode.${watch('mode.type')}.repoUrl`),
                    )?.name || watch(`mode.${watch('mode.type')}.repoUrl`)
                  }
                  onChange={(e, value: { label: string; codeRepo: GetCodeRepoApiResponse }) => {
                    const label: string = value?.label || ''
                    const codeRepo: GetCodeRepoApiResponse = value?.codeRepo || ({} as GetCodeRepoApiResponse)
                    const { repositoryUrl, gitService, private: isPrivate, secret } = codeRepo
                    if (!buildName) setValue('imageName', label)
                    setValue(`mode.${watch('mode.type')}.repoUrl`, repositoryUrl)
                    setValue(`mode.${watch('mode.type')}.revision`, undefined)
                    setValue('externalRepo', gitService !== 'gitea')
                    setGitService(gitService)
                    setRepoName(label)
                    if (isPrivate) setValue('secretName', secret)
                    else unregister('secretName')
                  }}
                  errorText={errors?.mode?.[`${watch('mode.type')}`]?.repoUrl?.message?.toString()}
                  disabled={!!buildName}
                />

                <Autocomplete
                  label='Reference'
                  loading={isLoadingRepoBranches}
                  options={(repoBranches || []).map((branch) => {
                    return { label: branch }
                  })}
                  placeholder='Select a reference'
                  {...register(`mode.${watch('mode.type')}.revision`)}
                  value={watch(`mode.${watch('mode.type')}.revision`) || ''}
                  onChange={(e, value: { label: string }) => {
                    const label: string = value?.label || ''
                    setValue(`mode.${watch('mode.type')}.revision`, label)
                    if (!buildName) setValue('tag', label)
                  }}
                  errorText={errors?.mode?.[`${watch('mode.type')}`]?.revision?.message?.toString()}
                />

                <TextField
                  label='Path'
                  width='large'
                  {...register(`mode.${watch('mode.type')}.path`)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue(`mode.${watch('mode.type')}.path`, value)
                  }}
                  error={!!errors?.mode?.[`${watch('mode.type')}`]?.path}
                  helperText={errors?.mode?.[`${watch('mode.type')}`]?.path?.message?.toString() || pathHelperText}
                />
              </FormRow>

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Typography variant='h6'>Image name and tag</Typography>
              <FormRow spacing={10} sx={{ mb: 2, alignItems: 'flex-start' }}>
                <TextField
                  label='Image name'
                  width='medium'
                  {...register('imageName')}
                  value={watch('imageName')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('imageName', value)
                  }}
                  error={!!errors.imageName}
                  helperText={errors?.imageName?.message?.toString()}
                  disabled={!!buildName}
                />
                <TextField
                  label='Tag'
                  width='medium'
                  {...register('tag')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('tag', value)
                  }}
                  error={!!errors.tag}
                  helperText={errors?.tag?.message?.toString()}
                  disabled={!!buildName}
                />
              </FormRow>
              <Typography
                variant='body1'
                sx={{
                  display: 'inline-block',
                  fontSize: 16,
                  fontWeight: 400,
                  color: theme.palette.cl.text.subTitle,
                }}
              >
                {buildName
                  ? `Full repository name: harbor.${domainSuffix}/team-${teamId}/${buildData.imageName}:${buildData.tag}`
                  : `Full repository name: harbor.${domainSuffix}/team-${teamId}/${watch('imageName') || '___'}:${
                      watch('tag') || '___'
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
                name={`mode.${watch('mode.type')}.envVars`}
                {...register(`mode.${watch('mode.type')}.envVars`)}
              />

              <Divider sx={{ mt: 2, mb: 2 }} />

              <Typography variant='h6'>Extra options</Typography>
              <Box>
                {gitService === 'gitea' && (
                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    name='trigger'
                    control={control}
                    label='Create webhook listener'
                    explainertext='Select to trigger the build based on a repository webhook event'
                  />
                )}
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='scanSource'
                  control={control}
                  label='Scan source code'
                  explainertext='Select to scan source code for vulnerabilities'
                />
              </Box>
            </Section>
            {buildName && (
              <DeleteButton
                onDelete={() => del({ teamId, buildName })}
                resourceName={watch('name')}
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
