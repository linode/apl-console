/* eslint-disable no-nested-ternary */
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Modal, Typography, styled } from '@mui/material'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import InformationBanner from 'components/InformationBanner'
import { TextField } from 'components/forms/TextField'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocalStorage } from 'react-use'
import { useSession } from 'providers/Session'
import { useMigrateGitMutation } from 'redux/otomiApi'
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
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
  borderRadius: 16,
  padding: 0,
  overflow: 'hidden',
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

const ModalFooter = styled('div')({
  borderTop: '1px dashed rgba(145, 158, 171, 0.24)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '24px 36px',
  gap: '16px',
})

const CenteredFooterActions = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const ModalTitle = styled(Typography)({
  marginBottom: '25px',
  fontWeight: 600,
  letterSpacing: 0,
  fontSize: '1.8rem',
})

const BodyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.05rem',
  lineHeight: 1.5,
}))

const IntroParagraph = styled(BodyText)({
  marginBottom: '24px',
})

const SectionTitle = styled(Typography)({
  marginBottom: '4px',
  fontWeight: 550,
  letterSpacing: '0.035em',
})

const SectionDescription = styled(Typography)(({ theme }) => ({
  marginBottom: '10px',
  color: theme.palette.text.secondary,
}))

const DividerSection = styled(Box)({
  borderTop: '1px solid rgba(145, 158, 171, 0.24)',
  paddingTop: '16px',
})

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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '24px auto 40px',
  animation: 'iconPop 280ms ease-out',
}))

const SuccessHeading = styled(Typography)({
  marginBottom: '16px',
  fontWeight: 600,
})

const SuccessCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: '16px',
  opacity: 0.8,
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
        stroke='#2f2f38'
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

export default function ConfigureGitModal({ open, onClose }: ConfigureGitModalProps) {
  const {
    user: { isPlatformAdmin },
    settings: {
      otomi: { isPreInstalled },
    },
  } = useSession()

  const [showGitWizard, setShowGitWizard] = useLocalStorage<boolean>('showGitConfigureWizard', true)
  const [showFormStep, setShowFormStep] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [migrationSucceeded, setMigrationSucceeded] = useState(false)

  const [migrateGit, { isLoading: isMigrating }] = useMigrateGitMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GitSettingsFormValues>({
    resolver: yupResolver(gitSettingsSchema),
    defaultValues: {
      repoUrl: '',
      branch: '',
      username: '',
      password: '',
      email: '',
    },
    mode: 'onBlur',
  })

  const isControlled = typeof open === 'boolean'
  const actualOpen = useMemo(() => (isControlled ? !!open : !!showGitWizard), [isControlled, open, showGitWizard])

  const resetModalState = () => {
    setShowFormStep(false)
    setSubmitError('')
    setMigrationSucceeded(false)
    setIsTransitioning(false)
    reset()
  }

  useEffect(() => {
    if (showGitWizard === undefined) setShowGitWizard(true)
  }, [showGitWizard, setShowGitWizard])

  useEffect(() => {
    if (!isPreInstalled && !isControlled) setShowGitWizard(false)
  }, [isPreInstalled, isControlled, setShowGitWizard])

  useEffect(() => {
    if (!actualOpen) resetModalState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualOpen])

  const handleClose = () => {
    resetModalState()

    if (isControlled) {
      onClose?.()
      return
    }

    setShowGitWizard(false)
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

  if (!isPlatformAdmin || !isPreInstalled) return null
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
          {!showFormStep ? (
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

                {!!submitError && <InformationBanner message={submitError} />}

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
                  Configure later
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
