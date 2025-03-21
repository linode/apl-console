import { Box, Button, Grid, Link, MenuItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import {
  CreateCodeRepoApiResponse,
  useCreateCodeRepoMutation,
  useDeleteCodeRepoMutation,
  useEditCodeRepoMutation,
  useGetCodeRepoQuery,
  useGetInternalRepoUrlsQuery,
  useGetSealedSecretsQuery,
  useGetTestRepoConnectQuery,
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
import { coderepoApiResponseSchema } from './create-edit.validator'
import { useStyles } from './create-edit.styles'

const extractRepoName = (url: string): string => {
  const match = url.match(/\/([^/]+)\.git$/)
  return match ? match[1] : url
}

interface Params {
  teamId: string
  codeRepositoryName?: string
}

export default function CreateEditCodeRepositories({
  match: {
    params: { teamId, codeRepositoryName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const history = useHistory()
  const location = useLocation()
  const locationState = location?.state as any
  const prefilledData = locationState?.prefilled as CreateCodeRepoApiResponse
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const {
    settings: { cluster },
  } = useSession()
  const [testConnectUrl, setTestConnectUrl] = useState<string | null>(null)
  const [showConnectResult, setShowConnectResult] = useState<boolean>(false)
  const [secretName, setSecretName] = useState<string | undefined>(undefined)
  const [gitProvider, setGitProvider] = useState<string | null>(null)
  const options = [
    {
      value: 'gitea',
      label: 'Gitea',
      imgSrc: '/logos/gitea_logo.svg',
    },
    {
      value: 'github',
      label: 'GitHub',
      imgSrc: '/logos/github_logo.svg',
    },
    {
      value: 'gitlab',
      label: 'GitLab',
      imgSrc: '/logos/gitlab_logo.svg',
    },
  ]

  // api calls
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateCodeRepoMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditCodeRepoMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteCodeRepoMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetCodeRepoQuery(
    { teamId, codeRepositoryName },
    { skip: !codeRepositoryName },
  )
  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const teamSecrets =
    teamSealedSecrets?.filter(
      (secret) => secret.type === 'kubernetes.io/basic-auth' || secret.type === 'kubernetes.io/ssh-auth',
    ) || []
  const {
    data: internalRepoUrls,
    isLoading: isLoadingRepoUrls,
    isFetching: isFetchingRepoUrls,
    isError: isErrorRepoUrls,
    refetch: refetchRepoUrls,
  } = useGetInternalRepoUrlsQuery({ teamId }, { skip: !gitProvider })
  const { data: testRepoConnect, isFetching: isFetchingTestRepoConnect } = useGetTestRepoConnectQuery(
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

  // form state
  const defaultValues = { gitService: 'gitea' as 'gitea' | 'github' | 'gitlab', ...prefilledData }
  const methods = useForm<CreateCodeRepoApiResponse>({
    resolver: yupResolver(coderepoApiResponseSchema) as Resolver<CreateCodeRepoApiResponse>,
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
    if (data) {
      reset(data)
      setGitProvider(watch('gitService'))
    } else setGitProvider('gitea')

    if (!isEmpty(prefilledData)) {
      reset(prefilledData)
      setGitProvider(prefilledData.gitService)
    }
  }, [data, setValue, prefilledData])

  useEffect(() => {
    if (gitProvider === 'gitea') {
      resetField('repositoryUrl')
      resetField('private')
      resetField('secret')
    }
    setTestConnectUrl(null)
  }, [gitProvider])

  useEffect(() => {
    const url = watch('repositoryUrl')
    if (url) {
      const githubRegex = /^(https:\/\/github\.com|git@github\.com)/
      const gitlabRegex = /^(https:\/\/gitlab\.com|git@gitlab\.com)/
      if (githubRegex.test(url)) {
        setValue('gitService', 'github')
        setGitProvider('github')
      } else if (gitlabRegex.test(url)) {
        setValue('gitService', 'gitlab')
        setGitProvider('gitlab')
      }
    }
  }, [watch('repositoryUrl')])

  const handleTestConnection = async () => {
    setShowConnectResult(false)
    let validSecret = true
    if (watch('private')) {
      validSecret = await trigger('secret')
      setSecretName(watch('secret'))
    } else setSecretName(undefined)
    const validRepositoryUrl = await trigger('repositoryUrl')
    if (validRepositoryUrl && validSecret) setTestConnectUrl(watch('repositoryUrl'))
    setShowConnectResult(true)
  }

  const onSubmit = (data: CreateCodeRepoApiResponse) => {
    if (codeRepositoryName) update({ teamId, codeRepositoryName, body: data })
    else create({ teamId, body: data })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/coderepositories`} />

  const loading = isLoading || isLoadingTeamSecrets || isLoadingRepoUrls || (codeRepositoryName && !internalRepoUrls)
  const error = isError || isErrorTeamSecrets || isErrorRepoUrls

  if (loading) return <PaperLayout loading title={t('TITLE_CODEREPOSITORY')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_CODEREPOSITORY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/get-started/overview'
          title='Code Repository'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section noPaddingTop>
              <FormRow spacing={10}>
                <TextField
                  label='Code Repository Label'
                  width='large'
                  {...register('name')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('name', value)
                  }}
                  error={!!errors.name}
                  helperText={errors.name?.message?.toString()}
                />
              </FormRow>
            </Section>

            <Section title='Code Repository' description='A code repository from an internal or external Git service'>
              <ImgButtonGroup
                title='Git Service'
                name='gitService'
                control={control}
                options={options}
                value={gitProvider}
                onChange={(value) => {
                  setGitProvider(value)
                }}
              />

              {gitProvider === 'gitea' && internalRepoUrls ? (
                <Box>
                  <TextField
                    label='Repository'
                    fullWidth
                    {...register('repositoryUrl')}
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('repositoryUrl', value)
                    }}
                    error={!!errors.repositoryUrl}
                    width='large'
                    value={watch('repositoryUrl') || ''}
                    select
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
                    {...register('repositoryUrl')}
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('repositoryUrl', value)
                    }}
                    error={!!errors.repositoryUrl}
                    helperText={errors.repositoryUrl?.message}
                    width='large'
                  />

                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    name='private'
                    control={control}
                    label='Private'
                    explainertext='Select if repository is private'
                  />

                  {watch('private') && (
                    <Box>
                      <TextField
                        label='Secret'
                        fullWidth
                        {...register('secret')}
                        onChange={(e) => {
                          const value = e.target.value
                          setValue('secret', value)
                          setShowConnectResult(false)
                        }}
                        error={!!errors.secret}
                        helperText={errors.secret?.message || 'A secret that contains the authentication credentials'}
                        helperTextPosition='top'
                        width='large'
                        value={watch('secret')}
                        select
                      >
                        <MenuItem value='' disabled>
                          Select a secret
                        </MenuItem>
                        {teamSecrets?.map((secret) => (
                          <MenuItem key={secret?.id} id={secret?.id} value={secret?.name}>
                            {secret?.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button
                        className={classes.link}
                        onClick={() =>
                          history.push(`/teams/${teamId}/create-sealedsecret`, {
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
                          <Typography
                            variant='h6'
                            sx={{
                              display: 'inline-block',
                              fontSize: 16,
                              fontWeight: 400,
                            }}
                          >
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
                resourceName={watch('name')}
                resourceType='coderepo'
                data-cy='button-delete-coderepo'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
              />
            )}
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right', textTransform: 'none' }}>
              {codeRepositoryName ? 'Edit Code Repository' : 'Add Code Repository'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
