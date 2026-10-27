import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/material/Button'
import { Box, Button, Modal, Typography, styled } from '@mui/material'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import InformationBanner from 'components/InformationBanner'
import { TextField } from 'components/forms/TextField'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'
import { useResetPasswordMutation } from 'redux/passwordApi'
import { modalClosed, modalOpened } from 'redux/reducers'
import snack from 'utils/snack'
import { ResetPasswordFormValues, resetPasswordSchema } from './resetPasswordValidator'

const MODAL_TITLE = 'Reset Password'
const DEFAULT_ERROR_MESSAGE = 'Something went wrong while resetting your password.'

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 560,
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
}))

const ModalContent = styled('div')({
  padding: '40px 52px 32px 52px',
})

const ModalTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '25px',
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  color: theme.palette.text.primary,
  fontWeight: 700,
  letterSpacing: 0,
  fontSize: '1.5rem',
}))

const FieldsStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
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
    minWidth: 140,
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

const emptyFormValues: ResetPasswordFormValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function getErrorMessage(error: unknown): string {
  const fetchError = error as FetchBaseQueryError & {
    data?: { message?: string; error?: string }
    error?: string
  }

  if (typeof fetchError?.data === 'object' && fetchError.data !== null)
    return fetchError.data.message || fetchError.data.error || DEFAULT_ERROR_MESSAGE

  if (typeof fetchError?.error === 'string' && fetchError.error.length > 0) return fetchError.error

  return DEFAULT_ERROR_MESSAGE
}

interface ResetPasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ResetPasswordModal({ open, onClose }: ResetPasswordModalProps) {
  const dispatch = useAppDispatch()
  const [submitError, setSubmitError] = useState('')
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: emptyFormValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!open) return undefined

    dispatch(modalOpened())

    return () => {
      dispatch(modalClosed())
    }
  }, [open, dispatch])

  const handleClose = () => {
    if (isLoading) return
    reset(emptyFormValues)
    setSubmitError('')
    onClose()
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setSubmitError('')

    try {
      const result = await resetPassword({
        body: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      })

      if ('error' in result) {
        setSubmitError(getErrorMessage(result.error))
        return
      }

      snack.success('Password reset successfully')
      reset(emptyFormValues)
      onClose()
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    }
  }

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return
        handleClose()
      }}
    >
      <ModalBox>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ModalContent>
            <ModalTitle variant='h4'>{MODAL_TITLE}</ModalTitle>

            {!!submitError && <InformationBanner type='error' message={submitError} sx={{ mb: 2 }} />}

            <FieldsStack>
              <Controller
                name='oldPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Old password'
                    type='password'
                    autoComplete='current-password'
                    fullWidth
                    width='fullwidth'
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword?.message}
                  />
                )}
              />

              <Controller
                name='newPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='New password'
                    type='password'
                    autoComplete='new-password'
                    fullWidth
                    width='fullwidth'
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />

              <Controller
                name='confirmPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Confirm password'
                    type='password'
                    autoComplete='new-password'
                    fullWidth
                    width='fullwidth'
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </FieldsStack>
          </ModalContent>

          <ModalFooter>
            <Button variant='outlined' color='primary' onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>

            <LoadingButton type='submit' variant='contained' color='primary' loading={isLoading}>
              Reset
            </LoadingButton>
          </ModalFooter>
        </form>
      </ModalBox>
    </Modal>
  )
}
