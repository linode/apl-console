import { Box, Button, Grid, Link, MenuItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateCoderepoApiResponse,
  useCreateCoderepoMutation,
  useDeleteCoderepoMutation,
  useEditCoderepoMutation,
  useGetCoderepoQuery,
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
import { coderepoApiResponseSchema } from './create-edit.validator'
import { useStyles } from './create-edit.styles'

const extractRepoName = (url: string): string => {
  const match = url.match(/\/([^/]+)\.git$/)
  return match ? match[1] : url
}

interface Params {
  teamId: string
  coderepositoryId?: string
}

export default function ({
  match: {
    params: { teamId, coderepositoryId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const {
    settings: { cluster },
  } = useSession()
  const [testConnectUrl, setTestConnectUrl] = useState<string | null>(null)
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
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateCoderepoMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditCoderepoMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteCoderepoMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetCoderepoQuery(
    { teamId, coderepoId: coderepositoryId },
    { skip: !coderepositoryId },
  )
  const {
    data: teamSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const {
    data: internalRepoUrls,
    isLoading: isLoadingRepoUrls,
    isFetching: isFetchingRepoUrls,
    isError: isErrorRepoUrls,
    refetch: refetchRepoUrls,
  } = useGetInternalRepoUrlsQuery({ teamId }, { skip: !gitProvider })
  const { data: testRepoConnect } = useGetTestRepoConnectQuery({ url: testConnectUrl }, { skip: !testConnectUrl })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
    if (!isFetchingRepoUrls) refetchRepoUrls()
  }, [isDirty])

  // form state
  const defaultValues = { ...data }
  const methods = useForm<CreateCoderepoApiResponse>({
    resolver: yupResolver(coderepoApiResponseSchema) as Resolver<CreateCoderepoApiResponse>,
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
  } = methods

  useEffect(() => {
    if (data) {
      reset(data)
      setGitProvider(watch('gitService'))
    }
  }, [data, setValue])

  useEffect(() => {
    resetField('repositoryUrl')
    resetField('private')
    resetField('secret')
  }, [gitProvider])

  const onSubmit = (data: CreateCoderepoApiResponse) => {
    if (coderepositoryId) update({ teamId, coderepoId: coderepositoryId, body: data })
    else create({ teamId, body: data })
  }
  const onDelete = () => {
    if (coderepositoryId) del({ teamId, coderepoId: coderepositoryId })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/coderepositories`} />

  const loading = isLoading || isLoadingTeamSecrets || isLoadingRepoUrls || (coderepositoryId && !internalRepoUrls)
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
                  {...register('label')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('label', value)
                  }}
                  error={!!errors.label}
                  helperText={errors.label?.message?.toString()}
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
                    sx={{ fontSize: '0.625rem', fontWeight: 400 }}
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

                  <TextField
                    label='Secret'
                    fullWidth
                    {...register('secret')}
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('secret', value)
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
                  <Link sx={{ fontSize: '0.625rem', fontWeight: 400 }} href={`/teams/${teamId}/create-sealedsecret`}>
                    + Create Secret
                  </Link>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 2 }}>
                    <Box>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => setTestConnectUrl(watch('repositoryUrl'))}
                        sx={{ textTransform: 'none' }}
                      >
                        Test Connection
                      </Button>
                    </Box>
                    {testRepoConnect?.status && testRepoConnect?.status !== 'unknown' && (
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
            {coderepositoryId && (
              <Button
                onClick={onDelete}
                variant='contained'
                color='primary'
                sx={{ float: 'right', textTransform: 'none', ml: 2 }}
              >
                Delete
              </Button>
            )}
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right', textTransform: 'none' }}>
              {coderepositoryId ? 'Edit Code Repository' : 'Add Code Repository'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
