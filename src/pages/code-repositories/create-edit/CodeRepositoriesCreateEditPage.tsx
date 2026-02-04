import { Box, Button, Grid, Link, MenuItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import {
  CreateAplCodeRepoApiArg,
  CreateAplCodeRepoApiResponse,
  useCreateAplCodeRepoMutation,
  useDeleteAplCodeRepoMutation,
  useEditAplCodeRepoMutation,
  useGetAplCodeRepoQuery,
  useGetAplSealedSecretsQuery,
  useGetInternalRepoUrlsQuery,
  useGetTeamAplCodeReposQuery,
  useTestRepoConnectQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import FormRow from 'components/forms/FormRow'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import ImgButtonGroup from 'components/ImgButtonGroup'
import Iconify from 'components/Iconify'
import { useAppSelector } from 'redux/hooks'
import { useSession } from 'providers/Session'
import Section from 'components/Section'
import DeleteButton from 'components/DeleteButton'
import { isEmpty } from 'lodash'
import { LoadingButton } from '@mui/lab'
import { aplCodeRepoApiSchema } from './create-edit-codeRepositories.validator'
import { useStyles } from './create-edit-codeRepositories.styles'

const extractRepoName = (url: string): string => {
  const match = url.match(/\/([^/]+)\.git$/)
  return match ? match[1] : url
}

interface Params {
  teamId: string
  codeRepositoryName?: string
}

export default function CodeRepositoriesCreateEditPage({
  match: {
    params: { teamId, codeRepositoryName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const history = useHistory()
  const location = useLocation()
  const locationState = location?.state as any

  const prefilledData = locationState?.prefilled as Partial<CreateAplCodeRepoApiResponse> | undefined

  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const {
    settings: { cluster },
  } = useSession()

  const [testConnectUrl, setTestConnectUrl] = useState<string | null>(null)
  const [showConnectResult, setShowConnectResult] = useState<boolean>(false)
  const [secretName, setSecretName] = useState<string | undefined>(undefined)
  const [gitProvider, setGitProvider] = useState<'gitea' | 'github' | 'gitlab' | null>(null)

  const options = [
    { value: 'gitea', label: 'Gitea', imgSrc: '/logos/gitea_logo.svg' },
    { value: 'github', label: 'GitHub', imgSrc: '/logos/github_logo.svg' },
    { value: 'gitlab', label: 'GitLab', imgSrc: '/logos/gitlab_logo.svg' },
  ]

  // v2 api calls
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplCodeRepoMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplCodeRepoMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplCodeRepoMutation()

  const { data, isLoading, isFetching, isError, refetch } = useGetAplCodeRepoQuery(
    { teamId, codeRepositoryName },
    { skip: !codeRepositoryName },
  )

  const { data: teamCodeRepositories } = useGetTeamAplCodeReposQuery({ teamId }, { skip: !teamId })

  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetAplSealedSecretsQuery({ teamId }, { skip: !teamId })

  const teamSecrets =
    teamSealedSecrets?.filter(
      (secret) =>
        secret?.spec?.template?.type === 'kubernetes.io/basic-auth' ||
        secret?.spec?.template?.type === 'kubernetes.io/ssh-auth',
    ) || []

  const {
    data: internalRepoUrls,
    isLoading: isLoadingRepoUrls,
    isFetching: isFetchingRepoUrls,
    isError: isErrorRepoUrls,
    refetch: refetchRepoUrls,
  } = useGetInternalRepoUrlsQuery({ teamId }, { skip: !gitProvider })

  const { data: testRepoConnect, isFetching: isFetchingTestRepoConnect } = useTestRepoConnectQuery(
    { url: testConnectUrl, teamId, secret: secretName },
    { skip: !testConnectUrl },
  )

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
    if (!isFetchingRepoUrls) refetchRepoUrls()
  }, [isDirty])

  // derive existing urls for uniqueness validation
  const codeRepoUrls = (teamCodeRepositories || []).map((cr) => cr?.spec?.repositoryUrl).filter(Boolean)

  const defaultValues = useMemo(() => {
    const base: CreateAplCodeRepoApiResponse = aplCodeRepoApiSchema.cast({
      kind: 'AplTeamCodeRepo',
      metadata: {
        name: '',
        labels: { 'apl.io/teamId': teamId },
      },
      spec: {
        gitService: 'gitea',
        repositoryUrl: '',
        private: false,
        secret: undefined,
      },
      status: { conditions: [], phase: undefined },
    }) as CreateAplCodeRepoApiResponse

    if (data) return aplCodeRepoApiSchema.cast(data) as CreateAplCodeRepoApiResponse

    if (!isEmpty(prefilledData)) {
      return aplCodeRepoApiSchema.cast({
        ...base,
        ...prefilledData,
        metadata: {
          ...(base.metadata ?? {}),
          ...(prefilledData?.metadata ?? {}),
          labels: { 'apl.io/teamId': teamId },
        },
      }) as CreateAplCodeRepoApiResponse
    }

    return base
  }, [data, prefilledData, teamId])

  const methods = useForm<CreateAplCodeRepoApiResponse>({
    resolver: yupResolver(aplCodeRepoApiSchema) as unknown as Resolver<CreateAplCodeRepoApiResponse>,
    defaultValues,
    context: { codeRepoUrls, validateOnSubmit: !codeRepositoryName },
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
    if (data) {
      reset(data)
      setGitProvider(watch('spec.gitService'))
    } else setGitProvider('gitea')

    if (!isEmpty(prefilledData)) {
      reset(defaultValues)
      setGitProvider(defaultValues.spec?.gitService ?? 'gitea')
    }
  }, [data, prefilledData, defaultValues, reset])

  useEffect(() => {
    if (gitProvider === 'gitea') {
      resetField('spec.repositoryUrl')
      resetField('spec.private')
      resetField('spec.secret')
    }
    setTestConnectUrl(null)
  }, [gitProvider])

  useEffect(() => {
    const url = watch('spec.repositoryUrl')
    if (url) {
      const githubRegex = /^(https:\/\/github\.com|git@github\.com)/
      const gitlabRegex = /^(https:\/\/gitlab\.com|git@gitlab\.com)/
      if (githubRegex.test(url)) {
        setValue('spec.gitService', 'github')
        setGitProvider('github')
      } else if (gitlabRegex.test(url)) {
        setValue('spec.gitService', 'gitlab')
        setGitProvider('gitlab')
      }
    }
  }, [watch('spec.repositoryUrl')])

  const handleTestConnection = async () => {
    setShowConnectResult(false)

    let validSecret = true
    if (watch('spec.private')) {
      validSecret = await trigger('spec.secret')
      setSecretName(watch('spec.secret'))
    } else setSecretName(undefined)

    const validRepositoryUrl = await trigger('spec.repositoryUrl')
    if (validRepositoryUrl && validSecret) setTestConnectUrl(watch('spec.repositoryUrl'))

    setShowConnectResult(true)
  }

  const onSubmit = (formData: CreateAplCodeRepoApiResponse) => {
    const body: CreateAplCodeRepoApiArg['body'] = {
      kind: 'AplTeamCodeRepo',
      metadata: {
        name: formData.metadata?.name ?? '',
      },
      spec: {
        gitService: formData.spec.gitService,
        repositoryUrl: formData.spec.repositoryUrl,
        private: formData.spec.private,
        secret: formData.spec.secret,
      },
    }

    if (codeRepositoryName) update({ teamId, codeRepositoryName, body })
    else create({ teamId, body })
  }

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/code-repositories`} />

  const loading = isLoading || isLoadingTeamSecrets || isLoadingRepoUrls || (codeRepositoryName && !internalRepoUrls)
  const error = isError || isErrorTeamSecrets || isErrorRepoUrls

  if (loading) return <PaperLayout loading title={t('TITLE_CODE_REPOSITORY')} />

  return (
    <Grid>
      <PaperLayout loading={loading || error} title={t('TITLE_CODE_REPOSITORY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/code-repositories'
          title={codeRepositoryName ? data?.metadata?.name ?? '' : 'Add'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[0, 1]}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section noPaddingTop>
              <FormRow spacing={10}>
                <TextField
                  label='Code Repository Name'
                  width='large'
                  {...register('metadata.name')}
                  onChange={(e) => setValue('metadata.name', e.target.value)}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!codeRepositoryName}
                />
              </FormRow>
            </Section>

            <Section title='Code Repository' description='A code repository from an internal or external Git service'>
              <ImgButtonGroup
                title='Git Service'
                name='spec.gitService'
                control={control}
                options={options}
                value={gitProvider}
                onChange={(value) => {
                  setGitProvider(value as any)
                  setValue('spec.gitService', value as any)
                }}
                disabled={!!codeRepositoryName}
              />

              {gitProvider === 'gitea' && internalRepoUrls ? (
                <Box>
                  <TextField
                    label='Repository'
                    fullWidth
                    {...register('spec.repositoryUrl')}
                    onChange={(e) => setValue('spec.repositoryUrl', e.target.value)}
                    error={!!errors.spec?.repositoryUrl}
                    width='large'
                    value={watch('spec.repositoryUrl') || ''}
                    select
                    disabled={!!codeRepositoryName}
                  >
                    <MenuItem value='' disabled>
                      Select a code repository
                    </MenuItem>
                    {internalRepoUrls?.map((repoUrl) => (
                      <MenuItem key={repoUrl} id={repoUrl} value={repoUrl}>
                        {extractRepoName(repoUrl)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Link
                    className={classes.link}
                    href={`https://gitea.${cluster.domainSuffix}/team-${teamId}`}
                    target='_blank'
                  >
                    + Create Repository
                  </Link>
                </Box>
              ) : (
                <Box>
                  <TextField
                    label='Repository URL'
                    fullWidth
                    {...register('spec.repositoryUrl')}
                    onChange={(e) => setValue('spec.repositoryUrl', e.target.value)}
                    error={!!errors.spec?.repositoryUrl}
                    helperText={errors.spec?.repositoryUrl?.message as any}
                    width='large'
                    disabled={!!codeRepositoryName}
                  />

                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    name='spec.private'
                    control={control}
                    label='Private'
                    explainertext='Select if repository is private'
                  />

                  {watch('spec.private') && (
                    <Box>
                      <TextField
                        label='Secret'
                        fullWidth
                        {...register('spec.secret')}
                        onChange={(e) => {
                          setValue('spec.secret', e.target.value)
                          setShowConnectResult(false)
                        }}
                        error={!!errors.spec?.secret}
                        helperText={
                          (errors.spec?.secret?.message as any) ||
                          'A secret that contains the authentication credentials'
                        }
                        helperTextPosition='top'
                        width='large'
                        value={watch('spec.secret') || ''}
                        select
                      >
                        <MenuItem value='' disabled>
                          Select a secret
                        </MenuItem>
                        {teamSecrets?.map((secret) => (
                          <MenuItem
                            key={secret?.metadata?.name}
                            id={secret?.metadata?.name}
                            value={secret?.metadata?.name}
                          >
                            {secret?.metadata?.name}
                          </MenuItem>
                        ))}
                      </TextField>

                      <Button
                        className={classes.link}
                        onClick={() =>
                          history.push(`/teams/${teamId}/secrets/create`, {
                            coderepository: true,
                            prefilled: watch(),
                          })
                        }
                      >
                        + Create Secret
                      </Button>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 2 }}>
                    <Box>
                      <LoadingButton
                        variant='contained'
                        color='primary'
                        onClick={handleTestConnection}
                        sx={{ textTransform: 'none' }}
                        loading={isFetchingTestRepoConnect}
                      >
                        Test Connection
                      </LoadingButton>
                    </Box>

                    {showConnectResult &&
                      !isFetchingTestRepoConnect &&
                      testConnectUrl &&
                      testRepoConnect?.status &&
                      testRepoConnect?.status !== 'unknown' && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '4px 12px',
                            gap: 1,
                            mt: 2,
                            border: `1px solid ${
                              testRepoConnect?.status === 'success'
                                ? theme.palette.success.main
                                : theme.palette.error.main
                            }`,
                            backgroundColor: `${
                              testRepoConnect?.status === 'success'
                                ? theme.palette.success.main
                                : theme.palette.error.main
                            }50`,
                            width: 'fit-content',
                          }}
                        >
                          <Iconify icon={testRepoConnect?.status === 'success' ? 'mdi:tick' : 'mdi:times'} />
                          <Typography variant='h6' sx={{ display: 'inline-block', fontSize: 16, fontWeight: 400 }}>
                            {testRepoConnect?.status === 'success'
                              ? 'Successfully connected with Git repository'
                              : 'Failed to connect with Git repository'}
                          </Typography>
                        </Box>
                      )}
                  </Box>
                </Box>
              )}
            </Section>

            {codeRepositoryName && (
              <DeleteButton
                onDelete={() => del({ teamId, codeRepositoryName })}
                resourceName={watch('metadata.name')}
                resourceType='coderepo'
                data-cy='button-delete-coderepo'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
                loading={isLoadingDelete}
                disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
              />
            )}

            {/* Hide edit button for Gitea */}
            {!(codeRepositoryName && gitProvider === 'gitea') && (
              <LoadingButton
                type='submit'
                variant='contained'
                color='primary'
                sx={{ float: 'right', textTransform: 'none' }}
                loading={isLoadingCreate || isLoadingUpdate}
                disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete}
              >
                {codeRepositoryName ? 'Save Changes' : 'Add Code Repository'}
              </LoadingButton>
            )}
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
