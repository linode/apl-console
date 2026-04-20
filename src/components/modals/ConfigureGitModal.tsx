import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Modal, Typography, styled } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { GitSettingsFormValues, gitSettingsSchema } from './gitSettingsValidator'

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

const ModalContent = styled('div')({
  padding: '40px 52px 32px 52px',
  minHeight: 360,
})

const ModalFooter = styled('div')({
  borderTop: '1px dashed rgba(145, 158, 171, 0.24)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '24px 36px',
  gap: '16px',
})

const SuccessBanner = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.success.main}`,
  color: theme.palette.common.white,
  borderRadius: 2,
  minHeight: 50,
  display: 'flex',
  alignItems: 'center',
  padding: '0 32px',
  whiteSpace: 'nowrap',
}))

interface ConfigureGitModalProps {
  open: boolean
  onClose: () => void
}

export default function ConfigureGitModal({ open, onClose }: ConfigureGitModalProps) {
  const [connectionLoading, setConnectionLoading] = useState(false)
  const [connectionSuccess, setConnectionSuccess] = useState(false)
  const [showFormStep, setShowFormStep] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (!open) {
      setShowFormStep(false)
      setConnectionSuccess(false)
      setConnectionLoading(false)
      setIsTransitioning(false)
      reset()
    }
  }, [open, reset])

  const goToFormStep = () => {
    setIsTransitioning(true)

    setTimeout(() => {
      setShowFormStep(true)
      setIsTransitioning(false)
    }, 180)
  }

  const handleTestConnection = async () => {
    const valid = await trigger()
    if (!valid) {
      setConnectionSuccess(false)
      return
    }

    setConnectionLoading(true)
    setConnectionSuccess(false)

    try {
      const values = getValues()
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (values.repoUrl && values.branch && values.username && values.password && values.email)
        setConnectionSuccess(true)
    } finally {
      setConnectionLoading(false)
    }
  }

  const onSubmit = async (data: GitSettingsFormValues) => {
    console.log('Git config submit:', data)
    handleClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        <Box
          sx={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 180ms ease, transform 180ms ease',
          }}
        >
          {!showFormStep ? (
            <>
              <ModalContent>
                <Typography variant='h4' sx={{ mb: 3, fontWeight: 600, letterSpacing: 0 }}>
                  Configure Git
                </Typography>

                <Typography
                  variant='body1'
                  sx={{ color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.5, mb: 4 }}
                >
                  App Platform is installed on a light weight Git server.
                </Typography>

                <Typography
                  variant='body1'
                  sx={{ color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.5, mb: 4 }}
                >
                  This Git server is ideal for testing the platform but not recommended for production workloads.
                </Typography>

                <Typography variant='body1' sx={{ color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  We recommend to configure an external Git Repo to install App Platform on, this step will only take a
                  few minutes
                </Typography>
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
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalContent>
                <Typography variant='h4' sx={{ mb: 5, fontWeight: 500, marginBottom: '25px', letterSpacing: 0 }}>
                  Configure Git - Bring your own Git
                </Typography>

                <Typography
                  variant='h2'
                  sx={{ mb: 4, fontWeight: 550, letterSpacing: '0.035em', marginBottom: '20px' }}
                >
                  Repository
                </Typography>

                <Box sx={{ mb: 4 }}>
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
                </Box>

                <Box sx={{ mb: 3 }}>
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
                          'Branch you want App Platform installed on. App Platform will automatically create the branch if it does not exist'
                        }
                        error={!!errors.branch}
                      />
                    )}
                  />
                </Box>

                <Box
                  sx={{
                    borderTop: '1px solid rgba(145, 158, 171, 0.24)',
                    pt: 2,
                  }}
                >
                  <Typography variant='h2' sx={{ mb: 0.5, fontWeight: 550, letterSpacing: '0.035em' }}>
                    Credentials
                  </Typography>

                  <Typography variant='body1' sx={{ mb: 4, color: 'text.secondary', marginBottom: '10px' }}>
                    Username and password will be used to authenticate to Git repository
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    <Controller
                      name='username'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Username'
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
                  </Box>

                  <Box sx={{ maxWidth: 840, mb: 4 }}>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Email address'
                          fullWidth
                          width='fullwidth'
                          helperText={errors.email?.message || 'Email address to use for Git commits'}
                          error={!!errors.email}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 4 }}>
                    <LoadingButton
                      variant='contained'
                      color='primary'
                      onClick={handleTestConnection}
                      loading={connectionLoading}
                    >
                      Test Connection
                    </LoadingButton>

                    {connectionSuccess && <SuccessBanner>Successfully connected with Git repository</SuccessBanner>}
                  </Box>
                </Box>
              </ModalContent>

              <ModalFooter>
                <Button variant='outlined' color='primary' onClick={handleClose}>
                  Configure later
                </Button>

                <LoadingButton type='submit' variant='contained' color='primary' loading={isSubmitting}>
                  Proceed
                </LoadingButton>
              </ModalFooter>
            </form>
          )}
        </Box>
      </ModalBox>
    </Modal>
  )
}
