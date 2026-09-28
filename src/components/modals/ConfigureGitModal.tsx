/* eslint-disable no-nested-ternary */
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, IconButton, Modal, Tooltip, Typography, styled } from '@mui/material'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import InformationBanner from 'components/InformationBanner'
import { TextField } from 'components/forms/TextField'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocalStorage } from 'react-use'
import { useSession } from 'providers/Session'
import { useGetGitSettingsQuery, useMigrateGitMutation } from 'redux/otomiApi'
import { useAppDispatch } from 'redux/hooks'
import { modalClosed, modalOpened } from 'redux/reducers'
import { DEFAULT_GIT_SERVER_URL } from 'utils/constants'
import { GitSettingsFormValues, gitSettingsSchema } from './gitSettingsValidator'

const MODAL_TITLE = 'Configure Git Repository'

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxWidth: '95vw',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  padding: 0,
  overflow: 'hidden',
  '& .MuiIconButton-root': {
    color: theme.palette.cm?.linkActiveLight ?? theme.palette.primary.main,
    borderRadius: 0,
    '&:hover': {
      color: theme.palette.cm?.buttonPrimaryHover ?? theme.palette.primary.dark,
    },
    '&.Mui-disabled': {
      color: theme.palette.action.disabled,
    },
  },
}))

const AnimatedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isTransitioning',
})<{ isTransitioning: boolean }>(({ isTransitioning }) => ({
  opacity: isTransitioning ? 0 : 1,
  transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
  transition: 'opacity 180ms ease, transform 180ms ease',
  '@keyframes drawCheck': {
    to: {
      strokeDashoffset: 0,
    },
  },
  '@keyframes iconPop': {
    '0%': {
      transform: 'scale(0.7)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}))

const ModalContent = styled('div')({
  padding: '40px 52px 32px 52px',
  minHeight: 300,
})

const ModalFooter = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '24px 36px',
  gap: '16px',
  '& .MuiButton-root': {
    borderWidth: '1px',
    borderRadius: 0,
    boxShadow: 'none',
    fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
  },
  '& .MuiButton-outlinedPrimary:not(.Mui-disabled)': {
    color: theme.palette.cm?.linkActiveLight ?? theme.palette.primary.main,
    borderColor: theme.palette.cm?.textBoxBorder ?? theme.palette.divider,
    '&:hover': {
      color: theme.palette.cm?.buttonPrimaryHover ?? theme.palette.primary.dark,
      borderColor: theme.palette.cm?.buttonPrimaryHover ?? theme.palette.primary.dark,
    },
  },
  '& .MuiButton-containedPrimary:not(.Mui-disabled)': {
    backgroundColor: theme.palette.cm?.linkActiveLight ?? theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.cm?.buttonPrimaryHover ?? theme.palette.primary.dark,
    },
  },
}))

const CenteredFooterActions = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const ModalTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '25px',
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  color: theme.palette.text.primary,
  fontWeight: 700,
  letterSpacing: 0,
  fontSize: '1.8rem',
}))

const BodyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
}))

const IntroParagraph = styled(BodyText)({
  marginBottom: '24px',
})

const DefaultGitUrlBlock = styled(Box)(({ theme }) => ({
  marginTop: '24px',
  padding: '14px 16px',
  borderRadius: 0,
  border: `1px solid ${theme.palette.cm?.textBoxBorder ?? theme.palette.divider}`,
  backgroundColor: theme.palette.cm?.textBox ?? theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  '& .MuiTypography-subtitle2': {
    fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '20px',
  },
}))

const DefaultGitUrlText = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '4px',
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontWeight: 700,
  color: theme.palette.text.primary,
  letterSpacing: '0.035em',
}))

const SectionDescription = styled(Typography)(({ theme }) => ({
  marginBottom: '10px',
  color: theme.palette.text.secondary,
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
}))

const DividerSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: '16px',
}))

const RepoFieldBlock = styled(Box)({
  marginBottom: '24px',
})

const BranchFieldBlock = styled(Box)({
  marginBottom: '24px',
})

const FieldsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  marginBottom: '24px',
  '@media (min-width: 900px)': {
    gridTemplateColumns: '1fr 1fr',
  },
})

const EmailFieldWrapper = styled(Box)({
  maxWidth: 840,
  marginBottom: '16px',
})

const SuccessContainer = styled(Box)({
  textAlign: 'center',
  paddingTop: '16px',
})

const SuccessIconWrapper = styled(Box)(({ theme }) => ({
  width: 90,
  height: 90,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '24px auto 40px',
  animation: 'iconPop 280ms ease-out',
}))

const SuccessHeading = styled(Typography)(({ theme }) => ({
  marginBottom: '16px',
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontWeight: 700,
  color: theme.palette.text.primary,
}))

const SuccessCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '16px',
}))

interface ConfigureGitModalProps {
  open?: boolean
  onClose?: () => void
}

type GitMigrationResponse = {
  message?: string
  statusCode?: number
}

function AnimatedCheckmark() {
  return (
    <svg width='64' height='64' viewBox='0 0 64 64' fill='none'>
      <path
        d='M14 34L27 47L50 19'
        stroke='currentColor'
        strokeWidth='6'
        strokeLinecap='round'
        strokeLinejoin='round'
        style={{
          strokeDasharray: 60,
          strokeDashoffset: 60,
          animation: 'drawCheck 700ms ease forwards',
        }}
      />
    </svg>
  )
}

function getGitMigrationDataError(data: unknown): string {
  const response = data as GitMigrationResponse

  if (response?.statusCode && response.statusCode >= 400)
    return response.message || 'Something went wrong while migrating Git settings.'

  return ''
}

function getErrorMessage(error: unknown): string {
  const fetchError = error as FetchBaseQueryError & {
    data?: { message?: string; error?: string }
    error?: string
    originalStatus?: number
    status?: number | string
  }

  if ('status' in (fetchError || {})) {
    if (typeof fetchError.data === 'object' && fetchError.data !== null)
      return fetchError.data.message || fetchError.data.error || 'Something went wrong while migrating Git settings.'

    if (fetchError.status === 'PARSING_ERROR' && fetchError.originalStatus === 200) return ''
    if (fetchError.status === 503) return 'The API is currently unavailable.'
    if (fetchError.status === 400 || fetchError.status === 404)
      return 'Cannot connect to the provided Git repository. Check the repository URL and credentials.'

    if (typeof fetchError.error === 'string' && fetchError.error.length > 0) return fetchError.error
  }

  return 'Something went wrong while migrating Git settings.'
}

const emptyGitFormValues: GitSettingsFormValues = {
  repoUrl: '',
  branch: '',
  username: '',
  password: '',
  email: '',
}

export default function ConfigureGitModal({ open, onClose }: ConfigureGitModalProps) {
  const {
    user: { isPlatformAdmin },
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()

  const [showGitWizard, setShowGitWizard] = useLocalStorage<boolean>('showGitConfigureWizard', true)

  const isControlled = typeof open === 'boolean'
  const actualOpen = useMemo(() => (isControlled ? !!open : !!showGitWizard), [isControlled, open, showGitWizard])
  const dispatch = useAppDispatch()

  const { data: gitSettings, isFetching: isFetchingGitSettings } = useGetGitSettingsQuery(undefined, {
    skip: !isPlatformAdmin || !actualOpen,
  })

  const defaultGitUrl = gitSettings?.repoUrl || ''
  const isDefaultGitConfiguration = gitSettings?.repoUrl?.includes(DEFAULT_GIT_SERVER_URL) ?? false
  const hasGitConfiguration = !!gitSettings?.repoUrl && !isDefaultGitConfiguration
  const displayedRepoUrl = isDefaultGitConfiguration && domainSuffix ? `https://git.${domainSuffix}/otomi/values` : ''

  const getGitFormValues = (): GitSettingsFormValues => ({
    repoUrl: hasGitConfiguration ? gitSettings?.repoUrl || '' : '',
    branch: hasGitConfiguration ? gitSettings?.branch || '' : '',
    username: hasGitConfiguration ? gitSettings?.username || '' : '',
    password: '',
    email: hasGitConfiguration ? gitSettings?.email || '' : '',
  })

  const [showFormStep, setShowFormStep] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [migrationSucceeded, setMigrationSucceeded] = useState(false)

  const [migrateGit, { isLoading: isMigrating }] = useMigrateGitMutation()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<GitSettingsFormValues>({
    resolver: yupResolver(gitSettingsSchema),
    defaultValues: emptyGitFormValues,
    mode: 'onBlur',
  })

  const resetModalState = () => {
    setShowFormStep(hasGitConfiguration)
    setSubmitError('')
    setMigrationSucceeded(false)
    setIsTransitioning(false)
    reset(getGitFormValues())
  }

  useEffect(() => {
    if (showGitWizard === undefined) setShowGitWizard(true)
  }, [showGitWizard, setShowGitWizard])

  useEffect(() => {
    if (!actualOpen) {
      resetModalState()
      return
    }

    if (!gitSettings) return

    reset(getGitFormValues())
    setShowFormStep(hasGitConfiguration)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualOpen, gitSettings, hasGitConfiguration])

  useEffect(() => {
    if (actualOpen) {
      const action = modalOpened()

      dispatch(action)

      return () => {
        const action = modalClosed()

        dispatch(action)
      }
    }

    return undefined
  }, [actualOpen, dispatch])

  const handleClose = () => {
    resetModalState()

    if (isControlled) {
      onClose?.()
      return
    }

    setShowGitWizard(false)
  }

  const handleCopyDefaultGitUrl = async () => {
    if (!displayedRepoUrl) return
    await navigator.clipboard.writeText(displayedRepoUrl)
  }

  const handleCopyRepoUrl = async () => {
    const repoUrl = getValues('repoUrl')

    if (!repoUrl) return

    await navigator.clipboard.writeText(repoUrl)
  }

  const goToFormStep = () => {
    setIsTransitioning(true)

    setTimeout(() => {
      setShowFormStep(true)
      setIsTransitioning(false)
    }, 180)
  }

  const onSubmit = async (data: GitSettingsFormValues) => {
    setSubmitError('')
    setMigrationSucceeded(false)

    try {
      const result = await migrateGit({
        body: {
          repoUrl: data.repoUrl.trim(),
          branch: data.branch.trim(),
          username: data.username?.trim() || undefined,
          password: data.password,
          email: data.email.trim(),
        },
      })

      if ('data' in result) {
        const dataError = getGitMigrationDataError(result.data)

        if (dataError) {
          setSubmitError(dataError)
          return
        }

        setMigrationSucceeded(true)
        return
      }

      if ('error' in result) {
        const message = getErrorMessage(result.error)

        if (!message) {
          setMigrationSucceeded(true)
          return
        }

        setSubmitError(message)
      }
    } catch (error) {
      const message = getErrorMessage(error)

      if (!message) {
        setMigrationSucceeded(true)
        return
      }

      setSubmitError(message)
    }
  }

  if (!isPlatformAdmin) return null
  if (!isControlled && !showGitWizard) return null

  return (
    <Modal
      open={actualOpen}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return
        if (isMigrating) return
        handleClose()
      }}
    >
      <ModalBox>
        <AnimatedContainer isTransitioning={isTransitioning}>
          {isFetchingGitSettings ? (
            <ModalContent>
              <ModalTitle variant='h4'>{MODAL_TITLE}</ModalTitle>
              <BodyText variant='body1'>Loading Git settings...</BodyText>
            </ModalContent>
          ) : !showFormStep ? (
            <>
              <ModalContent>
                <ModalTitle variant='h4'>{MODAL_TITLE}</ModalTitle>

                <IntroParagraph variant='body1'>App Platform is installed on a light weight Git server.</IntroParagraph>

                <IntroParagraph variant='body1'>
                  This Git server is ideal for testing the platform but not recommended for production workloads.
                </IntroParagraph>

                <BodyText variant='body1'>
                  Configuring an external Git Repo is recommended for installing App Platform.
                </BodyText>

                {!!defaultGitUrl && (
                  <DefaultGitUrlBlock>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant='subtitle2'>Current internal Git repository</Typography>
                      <DefaultGitUrlText variant='body2'>{displayedRepoUrl}</DefaultGitUrlText>
                    </Box>

                    <Tooltip title='Copy Git repository URL'>
                      <IconButton
                        aria-label='Copy Git repository URL'
                        color='primary'
                        onClick={handleCopyDefaultGitUrl}
                      >
                        <ContentCopyIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </DefaultGitUrlBlock>
                )}
              </ModalContent>

              <ModalFooter>
                <Button variant='outlined' color='primary' onClick={handleClose}>
                  Configure later
                </Button>

                <Button variant='contained' color='primary' onClick={goToFormStep}>
                  Proceed
                </Button>
              </ModalFooter>
            </>
          ) : migrationSucceeded ? (
            <>
              <ModalContent>
                <SuccessContainer>
                  <SuccessIconWrapper>
                    <AnimatedCheckmark />
                  </SuccessIconWrapper>

                  <SuccessHeading variant='h4'>Successfully connected to Git repository</SuccessHeading>

                  <BodyText variant='body1'>
                    The App Platform web interface is going to be restarted and will be unavailable for few minutes.
                  </BodyText>

                  <SuccessCaption variant='body2'>(You can now close this window)</SuccessCaption>
                </SuccessContainer>
              </ModalContent>

              <ModalFooter>
                <CenteredFooterActions>
                  <Button variant='contained' color='primary' onClick={handleClose} sx={{ minWidth: 140 }}>
                    Close
                  </Button>
                </CenteredFooterActions>
              </ModalFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalContent>
                <ModalTitle variant='h4'>{MODAL_TITLE}</ModalTitle>

                {hasGitConfiguration && (
                  <InformationBanner
                    sx={{ mb: 2 }}
                    message='Changing the Git repository URL will migrate App Platform to the new repository. Updating credentials only will not trigger a migration.'
                  />
                )}

                {!!submitError && <InformationBanner type='error' message={submitError} />}

                <RepoFieldBlock>
                  <Controller
                    name='repoUrl'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Git Repo url'
                        width='fullwidth'
                        fullWidth
                        error={!!errors.repoUrl}
                        helperText={errors.repoUrl?.message}
                        InputProps={
                          hasGitConfiguration
                            ? {
                                endAdornment: (
                                  <Tooltip title='Copy Git repository URL'>
                                    <IconButton
                                      edge='end'
                                      sx={{ mr: '0px' }}
                                      color='primary'
                                      onClick={handleCopyRepoUrl}
                                    >
                                      <ContentCopyIcon fontSize='small' />
                                    </IconButton>
                                  </Tooltip>
                                ),
                              }
                            : undefined
                        }
                      />
                    )}
                  />
                </RepoFieldBlock>

                <BranchFieldBlock>
                  <Controller
                    name='branch'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Branch'
                        width='fullwidth'
                        helperTextPosition='top'
                        fullWidth
                        helperText={
                          errors.branch?.message ||
                          'Branch App Platform will be installed on. App Platform will automatically create the branch if it does not exist.'
                        }
                        error={!!errors.branch}
                      />
                    )}
                  />
                </BranchFieldBlock>

                <DividerSection>
                  <SectionTitle variant='h2'>Credentials</SectionTitle>
                  <SectionDescription variant='body1'>
                    Username and password will be used to authenticate to Git repository
                  </SectionDescription>

                  <FieldsGrid>
                    <Controller
                      name='username'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Username (Optional)'
                          fullWidth
                          width='fullwidth'
                          error={!!errors.username}
                          helperText={errors.username?.message}
                        />
                      )}
                    />

                    <Controller
                      name='password'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Password'
                          type='password'
                          fullWidth
                          width='fullwidth'
                          error={!!errors.password}
                          helperText={errors.password?.message}
                        />
                      )}
                    />
                  </FieldsGrid>

                  <EmailFieldWrapper>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Email'
                          fullWidth
                          width='fullwidth'
                          helperText={errors.email?.message || 'Email address to use for Git commits'}
                          error={!!errors.email}
                        />
                      )}
                    />
                  </EmailFieldWrapper>
                </DividerSection>
              </ModalContent>

              <ModalFooter>
                <Button variant='outlined' color='primary' onClick={handleClose} disabled={isMigrating}>
                  {hasGitConfiguration ? 'Cancel' : 'Configure later'}
                </Button>

                <LoadingButton type='submit' variant='contained' color='primary' loading={isMigrating}>
                  Proceed
                </LoadingButton>
              </ModalFooter>
            </form>
          )}
        </AnimatedContainer>
      </ModalBox>
    </Modal>
  )
}
