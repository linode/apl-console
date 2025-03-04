import { Box, Button, Grid, MenuItem } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  CreateBuildApiResponse,
  GetBuildApiResponse,
  GetCoderepoApiResponse,
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useEditBuildMutation,
  useGetBuildQuery,
  useGetRepoBranchesQuery,
  useGetTeamCodereposQuery,
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
import { useStyles } from './create-edit.styles'
import { buildApiResponseSchema } from './create-edit.validator'

interface Params {
  teamId: string
  buildId?: string
}

export default function ({
  match: {
    params: { teamId, buildId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const { classes } = useStyles()
  const [data, setData]: any = useState()
  const [repoUrl, setRepoUrl] = useState('')
  const [secretName, setSecretName] = useState('')

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
  } = useGetBuildQuery({ teamId, buildId }, { skip: !buildId })
  const {
    data: codeRepos,
    isLoading: isLoadingCodeRepos,
    isFetching: isFetchingCodeRepos,
    isError: isErrorCodeRepos,
    refetch: refetchCodeRepos,
  } = useGetTeamCodereposQuery({ teamId })
  const {
    data: repoBranches,
    isLoading: isLoadingRepoBranches,
    isFetching: isFetchingRepoBranches,
    isError: isErrorRepoBranches,
    refetch: refetchRepoBranches,
  } = useGetRepoBranchesQuery({ url: repoUrl, teamId, secret: secretName }, { skip: !repoUrl })
  console.log('repoBranches', repoBranches)

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  // END HOOKS

  useEffect(() => {
    if (buildId) setData(buildData)
  }, [buildData, buildId])
  // END HOOKS

  // form state
  const defaultValues = {
    tag: 'latest',
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
    console.log('data', data)
    console.log('buildData', buildData)
    if (buildData) reset(buildData)
  }, [buildData, setValue])

  console.log(watch(), errors)

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/builds`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/builds/`} />

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
    if (buildId) update({ teamId, buildId, body })
    else create({ teamId, body })
  }

  const loading = isLoading

  if (loading || isError || (buildId && !buildData) || isLoadingCodeRepos)
    return <PaperLayout loading title={t('TITLE_BUILD')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading} title={t('TITLE_BUILD', { buildId, role: 'team' })}>
        <LandingHeader docsLabel='Docs' docsLink='https://apl-docs.net/docs/get-started/overview' title='Build' />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormRow spacing={10} sx={{ mb: 4 }}>
              <TextField
                label='Name'
                width='medium'
                {...register('name')}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('name', value)
                }}
                error={!!errors.name}
                helperText={errors?.name?.message?.toString()}
              />
            </FormRow>
            <Section
              title='Add a build'
              description='You can select your desired build tool and configure from what repository you want to build'
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
                <TextField
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
                    codeRepos.map((codeRepo: GetCoderepoApiResponse) => (
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
                        {codeRepo.label}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  label='Branch'
                  fullWidth
                  {...register(`mode.${watch('mode.type')}.revision`)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue(`mode.${watch('mode.type')}.revision`, value)
                  }}
                  error={!!errors.mode}
                  width='medium'
                  value={watch(`mode.${watch('mode.type')}.revision`)}
                  select
                >
                  <MenuItem value='' disabled>
                    Select a branch
                  </MenuItem>
                  {repoBranches &&
                    repoBranches.length > 0 &&
                    repoBranches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                </TextField>

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
                  title='Environment variables'
                  subTitle='You can optionally add environment variables that are being added to the runtime'
                  keyLabel='Name'
                  valueLabel='Value'
                  addLabel='Add environment variable'
                  name={`mode.${watch('mode.type')}.envVars`}
                  {...register(`mode.${watch('mode.type')}.envVars`)}
                />
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='trigger'
                  control={control}
                  label='Enable webhook listener'
                  explainertext='Select this if you want trigger build on repository webhook event.'
                />
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='scanSource'
                  control={control}
                  label='Scan source code'
                  explainertext='Select this if you want the source code to be scanned for vulnerabilities. This requires Trivy to be enabled.'
                />
              </Box>
            </Section>
            {buildId && (
              <DeleteButton
                onDelete={() => del({ teamId, buildId })}
                resourceName={watch('name')}
                resourceType='build'
                data-cy='button-delete-build'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
              />
            )}
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right', textTransform: 'none' }}>
              {buildId ? 'Edit Build' : 'Add Build'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
