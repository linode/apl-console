import { Box, Button, Grid } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  CreateBuildApiResponse,
  GetBuildApiResponse,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useEditBuildMutation,
  useGetBuildQuery,
  useGetRepoBranchesQuery,
  useGetTeamCodeReposQuery,
} from 'redux/otomiApi'
import { cloneDeep, filter, isEmpty, pick } from 'lodash'
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
import { Typography } from 'components/Typography'
import { useSession } from 'providers/Session'
import { useStyles } from './create-edit.styles'
import { buildApiResponseSchema } from './create-edit.validator'

interface Params {
  teamId: string
  buildName?: string
}

export default function ({
  match: {
    params: { teamId, buildName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const { classes } = useStyles()
  const [data, setData]: any = useState()
  const [repoUrl, setRepoUrl] = useState('')
  const [secretName, setSecretName] = useState('')
  const [gitService, setGitService] = useState('')
  const [customize, setCustomize] = useState(false)
  console.log('gitService', gitService)

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
  const {
    data: codeRepos,
    isLoading: isLoadingCodeRepos,
    isFetching: isFetchingCodeRepos,
    isError: isErrorCodeRepos,
    refetch: refetchCodeRepos,
  } = useGetTeamCodeReposQuery({ teamId })
  const {
    data: repoBranches,
    isLoading: isLoadingRepoBranches,
    isFetching: isFetchingRepoBranches,
    isError: isErrorRepoBranches,
    refetch: refetchRepoBranches,
  } = useGetRepoBranchesQuery({ url: repoUrl, teamId, secret: secretName }, { skip: !repoUrl })

  const buildDataModeType = buildData?.mode?.type
  const buildDataModeRevision: string = buildData?.mode?.[`${buildDataModeType}`]?.revision || ''
  let repoBranchesSet = [buildDataModeRevision]
  if (repoBranches) repoBranchesSet = Array.from(new Set([...(repoBranches as string[]), buildDataModeRevision]))

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  // END HOOKS

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
  })
  const {
    control,
    register,
    reset,
    resetField,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = methods

  useEffect(() => {
    if (watch('mode.type') === 'docker') setValue(`mode.${watch('mode.type')}.path`, './Dockerfile')
    else setValue(`mode.${watch('mode.type')}.path`, '')
  }, [watch('mode.type')])

  useEffect(() => {
    if (buildData) {
      reset(buildData)
      setRepoUrl(watch(`mode.${watch('mode.type')}.repoUrl`))
    }
  }, [buildData, setValue])

  console.log(watch())

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/container-images`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/container-images/`} />

  const onSubmit = () => {
    const body = cloneDeep(watch()) // Clone the form data
    const modeType = watch('mode.type') // Store mode type to avoid multiple calls

    if (body.mode[modeType]) {
      body.mode[modeType].envVars = filter(
        body.mode[modeType].envVars,
        (env) => !isEmpty(env.name) || !isEmpty(env.value),
      )
    }
    body.mode = pick(body.mode, ['type', modeType]) as GetBuildApiResponse['mode']
    console.log('body', body)
    if (buildName) update({ teamId, buildName, body })
    else create({ teamId, body })
  }

  const loading = isLoading
  const myRepoBranches = repoBranchesSet || []

  if (loading || isError || (buildName && !watch('name')))
    return <PaperLayout loading title={t('TITLE_CONTAINER_IMAGE')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading} title={t('TITLE_CONTAINER_IMAGE', { buildName, role: 'team' })}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/get-started/overview'
          title='Container Image'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormRow spacing={10} sx={{ mb: 1 }}>
              <TextField
                label='Image name'
                width='medium'
                {...register('name')}
                value={watch('name')}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('name', value)
                }}
                error={!!errors.name}
                helperText={errors?.name?.message?.toString()}
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
                mb: 4,
              }}
            >
              {`harbor.${domainSuffix}/team-${teamId}/${watch('name') || '___'}:${watch('tag') || '___'}`}
            </Typography>
            <Section
              title={buildName ? 'Edit the container image' : 'Create a container image'}
              description='Select the desired container image task and select the code repository to container image from'
            >
              <ImgButtonGroup
                name='mode.type'
                control={control}
                options={options}
                value={watch('mode.type')}
                onChange={(value) => {
                  setValue('mode.type', value as 'docker' | 'buildpacks')
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* <TextField
                  label='Repository'
                  fullWidth
                  {...register(`mode.${watch('mode.type')}.repoUrl`)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue(`mode.${watch('mode.type')}.repoUrl`, value)
                  }}
                  error={!!errors.mode}
                  width='medium'
                  value={watch(`mode.${watch('mode.type')}.repoUrl`) || ''}
                  select
                >
                  <MenuItem key='select-code-repository' value='' disabled>
                    Select a code repository
                  </MenuItem>
                  {codeRepos &&
                    codeRepos.length > 0 &&
                    codeRepos.map((codeRepo: GetCodeRepoApiResponse) => (
                      <MenuItem
                        key={codeRepo.repositoryUrl}
                        value={codeRepo.repositoryUrl}
                        onMouseDown={() => {
                          setValue('externalRepo', codeRepo.gitService !== 'gitea')
                          setRepoUrl(codeRepo.repositoryUrl)
                          if (codeRepo?.private) {
                            setValue('secretName', codeRepo.secret)
                            setSecretName(codeRepo.secret)
                          }
                        }}
                      >
                        {codeRepo.name}
                      </MenuItem>
                    ))}
                </TextField> */}

                <Autocomplete
                  label='Repository'
                  loading={isLoadingCodeRepos}
                  options={codeRepos?.map((codeRepo) => {
                    return { label: codeRepo.name }
                  })}
                  placeholder='Select a repository'
                  {...register(`mode.${watch('mode.type')}.repoUrl`)}
                  value={
                    codeRepos?.find(
                      ({ repositoryUrl }) => repositoryUrl === watch(`mode.${watch('mode.type')}.repoUrl`),
                    )?.name
                  }
                  onChange={(event, value) => {
                    const { label } = (value as any) || {}
                    console.log('label', label)
                    const codeRepo = codeRepos?.find(({ name }) => name === label)
                    console.log('codeRepo', codeRepo)
                    setValue('name', codeRepo.name)
                    setValue(`mode.${watch('mode.type')}.repoUrl`, codeRepo.repositoryUrl)
                    setValue('externalRepo', codeRepo.gitService !== 'gitea')
                    setGitService(codeRepo.gitService)
                    setRepoUrl(codeRepo.repositoryUrl)
                    if (codeRepo?.private) {
                      setValue('secretName', codeRepo.secret)
                      setSecretName(codeRepo.secret)
                    }
                  }}
                  helperText={errors?.[`mode.${watch('mode.type')}.repoUrl`]?.message?.toString()}
                />

                <Autocomplete
                  label='Reference'
                  loading={isLoadingRepoBranches}
                  options={myRepoBranches?.map((branch) => {
                    return { label: branch }
                  })}
                  placeholder='Select a reference'
                  {...register(`mode.${watch('mode.type')}.revision`)}
                  value={watch(`mode.${watch('mode.type')}.revision`)}
                  onChange={(event, value) => {
                    const { label } = (value as any) || {}
                    setValue(`mode.${watch('mode.type')}.revision`, label as string)
                    setValue('tag', label)
                  }}
                  helperText={errors?.[`mode.${watch('mode.type')}.revision`]?.message?.toString()}
                />

                <TextField
                  label='Path'
                  width='medium'
                  {...register(`mode.${watch('mode.type')}.path`)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue(`mode.${watch('mode.type')}.path`, value)
                  }}
                  error={!!errors[`mode.${watch('mode.type')}.path`]}
                  helperText={
                    errors?.[`mode.${watch('mode.type')}.path`]?.message?.toString() ||
                    'Relative sub-path to a source code directory'
                  }
                />
              </Box>
              <Divider sx={{ mt: 4, mb: 2 }} />
              <Box>
                <KeyValue
                  title='Extra arguments'
                  subTitle='Additional arguments to pass on to the build executor'
                  keyLabel='Name'
                  valueLabel='Value'
                  addLabel='Add argument'
                  name={`mode.${watch('mode.type')}.envVars`}
                  {...register(`mode.${watch('mode.type')}.envVars`)}
                />
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
              />
            )}
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right', textTransform: 'none' }}>
              {buildName ? 'Submit' : 'Create container image'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
