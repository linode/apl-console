import { yupResolver } from '@hookform/resolvers/yup'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Button, Modal, Typography } from '@mui/material'
import CopyToClipboard from 'components/CopyToClipboard'
import DeleteButton from 'components/DeleteButton'
import InformationBanner from 'components/InformationBanner'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateUserApiArg,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetAplTeamsQuery,
  useGetUserQuery,
} from 'redux/otomiApi'
import * as yup from 'yup'
import AccessManagement from './AccessManagement'
import TeamList from './TeamList'
import type { AccessLevel, UserFormData } from './user-create-edit.types'

interface Params {
  teamId?: string
  userId?: string
}

const accessLevels: AccessLevel[] = ['user', 'teamAdmin', 'platformAdmin']

const utf8ByteLength = (value: string) =>
  Array.from(value).reduce((length, character) => {
    const codePoint = character.codePointAt(0) ?? 0
    if (codePoint <= 0x7f) return length + 1
    if (codePoint <= 0x7ff) return length + 2
    if (codePoint <= 0xffff) return length + 3
    return length + 4
  }, 0)

function UserForm({ teamId, userId }: Params): React.ReactElement {
  const { user: sessionUser, settings, defaultPlatformAdminEmail } = useSession()
  const externalIDP = Boolean(settings?.otomi?.hasExternalIDP)
  const dexIssuer = settings?.otomi?.oidc?.authenticationLayer === 'dex'
  const platformAdmin = Boolean(sessionUser?.isPlatformAdmin)
  const teamAdmin = Boolean(sessionUser?.isTeamAdmin)
  const managedTeams = sessionUser?.teams ?? []
  const editing = Boolean(userId)
  const title = editing ? 'Edit' : 'Create'
  const redirectTo = teamId ? `/teams/${teamId}/users` : '/users'

  const [create, createState] = useCreateUserMutation()
  const [update, updateState] = useEditUserMutation()
  const [resetPassword, resetPasswordState] = useEditUserMutation()
  const [del, deleteState] = useDeleteUserMutation()
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [resetRequestError, setResetRequestError] = useState('')
  const [createdPassword, setCreatedPassword] = useState<string>()
  const [createCompleted, setCreateCompleted] = useState(false)
  const {
    currentData: user,
    isLoading: loadingUser,
    isFetching: fetchingUser,
    isError: userError,
  } = useGetUserQuery({ userId }, { skip: !userId || externalIDP })
  const {
    currentData: teams,
    isLoading: loadingTeams,
    isFetching: fetchingTeams,
    isError: teamsError,
  } = useGetAplTeamsQuery(undefined, { skip: externalIDP })

  const options = (teams ?? [])
    .map((team) => team.metadata.name)
    .filter((name) => (!teamId || name === teamId) && (platformAdmin || managedTeams.includes(name)))
  // User attributes are global, so existing memberships must also allow the change.
  const aclTeams = [...new Set([...(teamId ? [teamId] : managedTeams), ...(user?.teams ?? [])])]
  const deniedAttributes = platformAdmin
    ? []
    : aclTeams.flatMap((id) => sessionUser?.authz?.[id]?.deniedAttributes?.user ?? [])
  const isDenied = (attribute: string) =>
    deniedAttributes.some(
      (path) =>
        path === '*' || path === attribute || path.startsWith(`${attribute}.`) || path.startsWith(`${attribute}[`),
    )

  const outsideManagedScope =
    editing && !platformAdmin && (!user?.teams?.length || user.teams.some((team) => !managedTeams.includes(team)))
  const outsideRouteScope =
    Boolean(teamId) &&
    ((!platformAdmin && !managedTeams.includes(teamId)) || (editing && !user?.teams?.includes(teamId)))
  const protectedTarget =
    !platformAdmin &&
    (user?.isPlatformAdmin || (Boolean(defaultPlatformAdminEmail) && user?.email === defaultPlatformAdminEmail))
  // The team-admin flag applies to every membership, not just the team in the route.
  const readOnly =
    (!platformAdmin && (!teamAdmin || managedTeams.length === 0)) ||
    outsideManagedScope ||
    outsideRouteScope ||
    protectedTarget
  const requiredFieldsDenied = !editing && isDenied('email')
  const canSelectAccessLevel = (level: AccessLevel) =>
    (platformAdmin || level !== 'platformAdmin') &&
    (!isDenied('isPlatformAdmin') || (level === 'platformAdmin') === Boolean(user?.isPlatformAdmin)) &&
    (!isDenied('isTeamAdmin') || (level === 'teamAdmin') === Boolean(user?.isTeamAdmin))
  const disabledOptions = accessLevels.filter((level) => !canSelectAccessLevel(level))

  const schema: yup.SchemaOf<UserFormData> = yup.object({
    email: editing
      ? yup.string().defined()
      : yup.string().trim().email('Enter a valid email address').required('Email is required'),
    accessLevel: yup.mixed<AccessLevel>().oneOf(accessLevels).required(),
    teams: yup.array().of(yup.string().required()).required(),
  })
  const methods = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      accessLevel: 'user',
      teams: [],
    },
  })
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods

  useEffect(() => {
    let accessLevel: AccessLevel = 'user'
    if (user?.isPlatformAdmin) accessLevel = 'platformAdmin'
    else if (user?.isTeamAdmin) accessLevel = 'teamAdmin'
    reset({
      email: user?.email ?? '',
      accessLevel,
      teams: user?.teams ?? (teamId ? [teamId] : []),
    })
  }, [user, teamId, reset])

  const selectedAccessLevel = watch('accessLevel')
  const mutating =
    createState.isLoading || updateState.isLoading || resetPasswordState.isLoading || deleteState.isLoading
  const loading = loadingUser || fetchingUser || loadingTeams || fetchingTeams
  const unavailable = userError || teamsError || !teams || (editing && !user)
  const blocked = externalIDP || readOnly || requiredFieldsDenied || loading || unavailable || mutating
  const disabled = blocked || isSubmitting
  const deleteDisabled = disabled || user?.email === defaultPlatformAdminEmail

  const onSubmit = async (values: UserFormData) => {
    if (blocked || !canSelectAccessLevel(values.accessLevel)) return
    const isPlatformAdmin = platformAdmin && values.accessLevel === 'platformAdmin'
    const selectedTeams = values.teams.filter((team) => options.includes(team))
    const preservedTeams = (user?.teams ?? []).filter((team) => !options.includes(team))
    let payloadTeams = [...new Set([...preservedTeams, ...selectedTeams])]
    if (isDenied('teams')) payloadTeams = user?.teams ?? []
    if (isPlatformAdmin) payloadTeams = []

    // Explicit mapping excludes fetched secrets and user attributes not editable in this form.
    const body: CreateUserApiArg['body'] = {
      email: editing ? user.email : values.email,
      isPlatformAdmin,
      isTeamAdmin: !isPlatformAdmin && values.accessLevel === 'teamAdmin',
      teams: payloadTeams,
    }
    if (userId) await update({ userId, body })
    else {
      const result = await create({ body })
      if ('data' in result) {
        setCreatedPassword(result.data.initialPassword ?? '')
        setCreateCompleted(true)
      }
    }
  }

  const onResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError('')
    setConfirmPasswordError('')
    setResetRequestError('')
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      return
    }
    if (utf8ByteLength(newPassword) > 72) {
      setPasswordError('Password must be at most 72 bytes.')
      return
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.')
      return
    }
    if (!userId || !user || resetPasswordState.isLoading) return

    const result = await resetPassword({
      userId,
      body: { email: user.email, initialPassword: newPassword },
    })
    if ('data' in result) closeResetPassword()
    else setResetRequestError('Unable to reset the password. Please try again.')
  }

  const openResetPassword = () => {
    setPasswordError('')
    setConfirmPasswordError('')
    setResetRequestError('')
    setResetPasswordOpen(true)
  }

  const closeResetPassword = () => {
    if (resetPasswordState.isLoading) return
    setResetPasswordOpen(false)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setConfirmPasswordError('')
    setResetRequestError('')
  }

  const closeCreatedModal = () => setCreatedPassword(undefined)

  const onDelete = () => {
    if (!userId || deleteDisabled) return
    del({ userId })
  }

  if (externalIDP) {
    return (
      <PaperLayout>
        <LandingHeader title={title} />
        <InformationBanner message='User management is only available when using the internal identity provider (IDP).' />
      </PaperLayout>
    )
  }

  if (
    !mutating &&
    (updateState.isSuccess || deleteState.isSuccess || (createCompleted && createdPassword === undefined))
  )
    return <Redirect to={redirectTo} />

  if (userError || teamsError) {
    return (
      <PaperLayout>
        <LandingHeader title={title} />
        <InformationBanner type='error' message='Unable to load user management data.' />
      </PaperLayout>
    )
  }

  if (loading || unavailable) {
    return (
      <PaperLayout loading>
        <LandingHeader title={title} />
      </PaperLayout>
    )
  }

  return (
    <PaperLayout>
      <LandingHeader title={title} />
      {readOnly && (
        <InformationBanner
          message={
            outsideManagedScope
              ? 'This page is readonly: this user has memberships outside your managed teams, or no managed membership. Team admin access applies to all memberships.'
              : 'This page is readonly'
          }
          sx={{ mb: 3 }}
        />
      )}
      {requiredFieldsDenied && (
        <InformationBanner
          message='User creation is unavailable because you cannot edit the required user details.'
          sx={{ mb: 3 }}
        />
      )}
      <FormProvider {...methods}>
        <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <Section title='General'>
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id='user-email'
                  inputId='user-email'
                  label='Email'
                  type='email'
                  required={!editing}
                  disabled={disabled || isDenied('email')}
                  InputProps={{ readOnly: editing }}
                  errorText={fieldState.error?.message}
                  width='large'
                />
              )}
            />
            {editing && dexIssuer && platformAdmin && (
              <>
                <TextField
                  id='user-password'
                  inputId='user-password'
                  label='Password'
                  type='password'
                  value=''
                  placeholder='********'
                  disabled
                  width='large'
                />
                <Button
                  type='button'
                  variant='contained'
                  disabled={disabled}
                  sx={{ mt: 2 }}
                  onClick={openResetPassword}
                >
                  Reset Password
                </Button>
              </>
            )}
          </Section>
          <Controller
            name='accessLevel'
            control={control}
            render={({ field }) => (
              <AccessManagement
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                disabledOptions={disabledOptions}
              />
            )}
          />
          <Controller
            name='teams'
            control={control}
            render={({ field }) => (
              <TeamList
                options={options}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled || isDenied('teams') || selectedAccessLevel === 'platformAdmin'}
                helperText={
                  selectedAccessLevel === 'platformAdmin'
                    ? 'Platform admins have access to all teams. Team selections are not saved for platform admins.'
                    : 'Only teams you can manage in this context are selectable. Other existing memberships are preserved.'
                }
              />
            )}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
            {editing && (
              <DeleteButton
                disabled={deleteDisabled}
                loading={deleteState.isLoading}
                onDelete={onDelete}
                resourceName={user.email}
                resourceType='User email'
              />
            )}
            <Button type='submit' variant='contained' disabled={disabled} loading={mutating}>
              {editing ? 'Update User' : 'Create User'}
            </Button>
          </Box>
        </Box>
      </FormProvider>
      <Modal open={resetPasswordOpen} onClose={closeResetPassword}>
        <Box
          component='form'
          role='dialog'
          aria-labelledby='reset-password-title'
          onSubmit={onResetPassword}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 'calc(100% - 32px)', sm: 520 },
            maxWidth: '100%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id='reset-password-title' variant='h5' sx={{ mb: 3, fontWeight: 700 }}>
            Reset Password
          </Typography>
          {resetRequestError && (
            <Typography role='alert' color='error' sx={{ mb: 2 }}>
              {resetRequestError}
            </Typography>
          )}
          <TextField
            id='new-user-password'
            inputId='new-user-password'
            label='New password'
            type='password'
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            errorText={passwordError}
            disabled={resetPasswordState.isLoading}
            required
            width='large'
          />
          <TextField
            id='confirm-user-password'
            inputId='confirm-user-password'
            label='Confirm password'
            type='password'
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            errorText={confirmPasswordError}
            disabled={resetPasswordState.isLoading}
            required
            width='large'
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4,
              pt: 3,
              borderTop: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Button
              type='button'
              variant='outlined'
              onClick={closeResetPassword}
              disabled={resetPasswordState.isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={resetPasswordState.isLoading}
              loading={resetPasswordState.isLoading}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={createdPassword !== undefined} onClose={closeCreatedModal}>
        <Box
          role='dialog'
          aria-labelledby='user-created-title'
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 'calc(100% - 32px)', sm: 760 },
            maxWidth: '100%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 4 }}>
            <Typography id='user-created-title' variant='h4' align='center' sx={{ fontWeight: 700 }}>
              User Created
            </Typography>
            <CheckCircleIcon aria-label='Success' sx={{ color: 'success.main', fontSize: 32 }} />
          </Box>
          {createdPassword ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                  Initial password
                </Typography>
                <Typography color='text.secondary' sx={{ letterSpacing: 1 }}>
                  {'*'.repeat(Math.min(createdPassword.length, 16))}
                </Typography>
              </Box>
              <CopyToClipboard text={createdPassword} tooltipTitle='Copy initial password' />
            </Box>
          ) : (
            <Typography color='error'>
              The user was created, but the initial password was not returned. Reset the password from the edit page.
            </Typography>
          )}
          <Typography color='error' align='center' sx={{ mt: 4, mb: 5 }}>
            If you lose this password, you need to submit a new one on the “edit user” page.
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}
          >
            <Button variant='contained' onClick={closeCreatedModal} sx={{ minWidth: 160 }}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </PaperLayout>
  )
}

export default function UsersCreateEditPage({ match: { params } }: RouteComponentProps<Params>): React.ReactElement {
  return <UserForm key={JSON.stringify([params.teamId, params.userId])} {...params} />
}
