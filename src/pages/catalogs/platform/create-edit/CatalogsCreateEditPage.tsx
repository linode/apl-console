import { Box, Grid } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateAplCatalogApiArg,
  CreateAplCatalogApiResponse,
  useCreateAplCatalogMutation,
  useDeleteAplCatalogMutation,
  useEditAplCatalogMutation,
  useGetAplCatalogQuery,
  useTestRepoConnectQuery,
} from 'redux/otomiApi'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormRow from 'components/forms/FormRow'
import Section from 'components/Section'
import { useTheme } from '@mui/material/styles'
import { Divider } from 'components/Divider'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { Typography } from 'components/Typography'
import { LoadingButton } from '@mui/lab'
import Iconify from 'components/Iconify'
import DeleteButton from 'components/DeleteButton'
import { isEqual } from 'lodash'
import { useStyles } from './create-edit-catalog.styles'
import { aplCatalogApiSchema } from './create-edit-catalog.validator'

interface Params {
  catalogId?: string
}

export default function CatalogsCreateEditPage({
  match: {
    params: { catalogId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()

  const [testConnectUrl, setTestConnectUrl] = useState<string | null>(null)
  const [showConnectResult, setShowConnectResult] = useState<boolean>(false)

  // Api Calls
  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    isFetching: isFetchingCatalog,
    isError: isCatalogError,
  } = useGetAplCatalogQuery({ catalogId }, { skip: !catalogId })
  const { data: testRepoConnect, isFetching: isFetchingTestRepoConnect } = useTestRepoConnectQuery(
    { url: testConnectUrl },
    { skip: !testConnectUrl },
  )
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplCatalogMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplCatalogMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplCatalogMutation()

  // handlers
  const handleTestConnection = async () => {
    setShowConnectResult(false)

    const validRepositoryUrl = await trigger('spec.repositoryUrl')
    if (validRepositoryUrl) setTestConnectUrl(watch('spec.repositoryUrl'))

    setShowConnectResult(true)
  }

  const onSubmit = (submitData: CreateAplCatalogApiResponse) => {
    const body: CreateAplCatalogApiArg['body'] = {
      kind: 'AplCatalog',
      metadata: {
        name: submitData.metadata.name,
      },
      spec: {
        name: submitData.spec.name,
        repositoryUrl: submitData.spec.repositoryUrl,
        branch: submitData.spec.branch,
        enabled: submitData.spec.enabled,
      },
    }
    if (catalogId) update({ catalogId, body })
    else create({ body })
  }

  const methods = useForm<CreateAplCatalogApiResponse>({
    resolver: yupResolver(aplCatalogApiSchema) as unknown as Resolver<CreateAplCatalogApiResponse>,
    context: { validateOnSubmit: !catalogId },
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

  // Populate form when catalogData is loaded
  useEffect(() => {
    if (catalogData) reset(catalogData)
  }, [catalogData, reset])

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) return <Redirect to='/catalogs' />

  const loading = isLoadingCatalog || isFetchingCatalog
  const error = isCatalogError
  if (loading) return <PaperLayout loading title={t('TITLE_CATALOG')} />
  return (
    <Grid>
      <PaperLayout loading={loading || error} title={t('TITLE_CATALOG')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/catalogs'
          title={catalogId ? catalogData?.metadata?.name ?? '' : 'Create Catalog'}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section noPaddingTop>
              <FormRow spacing={10}>
                <TextField
                  label='Catalog name'
                  width='large'
                  {...register('metadata.name')}
                  onChange={(e) => {
                    setValue('metadata.name', e.target.value)
                    setValue('spec.name', e.target.value)
                  }}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!catalogId}
                />
              </FormRow>

              <Divider sx={{ mt: 4, mb: 2 }} />
              <FormRow spacing={10}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <TextField
                    label='Repository URL'
                    width='large'
                    {...register('spec.repositoryUrl')}
                    onChange={(e) => setValue('spec.repositoryUrl', e.target.value)}
                    error={!!errors.spec?.repositoryUrl}
                    helperText={errors.spec?.repositoryUrl?.message?.toString()}
                  />
                  <TextField
                    label='Branch'
                    width='large'
                    {...register('spec.branch')}
                    onChange={(e) => setValue('spec.branch', e.target.value)}
                    error={!!errors.spec?.branch}
                    helperText={errors.spec?.branch?.message?.toString()}
                  />
                </Box>
              </FormRow>

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
                          testRepoConnect?.status === 'success' ? theme.palette.success.main : theme.palette.error.main
                        }`,
                        backgroundColor: `${
                          testRepoConnect?.status === 'success' ? theme.palette.success.main : theme.palette.error.main
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

              <Divider sx={{ mt: 4, mb: 0 }} />

              <FormRow spacing={10}>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.enabled'
                  control={control}
                  label='Enabled'
                  explainertext='Enables or disables visibility of this catalog on the catalog page. Existing workloads using charts from this catalog are not effected.'
                  onChange={(e) => setValue('spec.enabled', e.target.checked)}
                />
              </FormRow>
            </Section>
            <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-end', alignItems: 'center' }}>
              {catalogId && (
                <DeleteButton
                  onDelete={() => del({ catalogId })}
                  resourceName={watch('metadata.name')}
                  resourceType='catalog'
                  data-cy='button-delete-catalog'
                  sx={{ marginRight: '10px', float: 'right', textTransform: 'capitalize', ml: 2 }}
                  loading={isLoadingDelete}
                  disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
                />
              )}
              <LoadingButton
                type='submit'
                variant='contained'
                color='primary'
                sx={{ textTransform: 'none' }}
                loading={isLoadingCreate || isLoadingUpdate}
                disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || isEqual(watch(), catalogData)}
              >
                {catalogId ? 'Save Changes' : 'Create Catalog'}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
