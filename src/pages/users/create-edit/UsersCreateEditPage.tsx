import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Typography } from '@mui/material'
import DeleteButton from 'components/DeleteButton'
import InformationBanner from 'components/InformationBanner'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
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
const nameFields = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
] as const

function UserForm({ teamId, userId }: Params): React.ReactElement {
  const { user: sessionUser, settings, defaultPlatformAdminEmail } = useSession()
  const externalIDP = Boolean(settings?.otomi?.hasExternalIDP)
  const platformAdmin = Boolean(sessionUser?.isPlatformAdmin)
  const teamAdmin = Boolean(sessionUser?.isTeamAdmin)
  const managedTeams = sessionUser?.teams ?? []
  const editing = Boolean(userId)
  const title = editing ? 'Edit' : 'Create'
  const redirectTo = teamId ? `/teams/${teamId}/users` : '/users'

  const [create, createState] = useCreateUserMutation()
  const [update, updateState] = useEditUserMutation()
  const [del, deleteState] = useDeleteUserMutation()
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
  const requiredFieldsDenied = !editing && ['email', 'firstName', 'lastName'].some(isDenied)
  const canSelectAccessLevel = (level: AccessLevel) =>
    (platformAdmin || level !== 'platformAdmin') &&
    (!isDenied('isPlatformAdmin') || (level === 'platformAdmin') === Boolean(user?.isPlatformAdmin)) &&
    (!isDenied('isTeamAdmin') || (level === 'teamAdmin') === Boolean(user?.isTeamAdmin))
  const disabledOptions = accessLevels.filter((level) => !canSelectAccessLevel(level))

  const schema: yup.SchemaOf<UserFormData> = yup.object({
    firstName: editing ? yup.string().defined() : yup.string().trim().required('First name is required'),
    lastName: editing ? yup.string().defined() : yup.string().trim().required('Last name is required'),
    email: editing
      ? yup.string().defined()
      : yup.string().trim().email('Enter a valid email address').required('Email is required'),
    accessLevel: yup.mixed<AccessLevel>().oneOf(accessLevels).required(),
    teams: yup.array().of(yup.string().required()).required(),
  })
  const methods = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
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
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      accessLevel,
      teams: user?.teams ?? (teamId ? [teamId] : []),
    })
  }, [user, teamId, reset])

  const selectedAccessLevel = watch('accessLevel')
  const mutating = createState.isLoading || updateState.isLoading || deleteState.isLoading
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

    // Explicit mapping excludes fetched secrets and preserves names not exposed in the edit form.
    const body: CreateUserApiArg['body'] = {
      email: editing ? user.email : values.email,
      firstName: editing ? user.firstName : values.firstName,
      lastName: editing ? user.lastName : values.lastName,
      isPlatformAdmin,
      isTeamAdmin: !isPlatformAdmin && values.accessLevel === 'teamAdmin',
      teams: payloadTeams,
    }
    if (userId) await update({ userId, body })
    else await create({ body })
  }

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

  if (!mutating && (createState.isSuccess || updateState.isSuccess || deleteState.isSuccess))
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
            {!editing &&
              nameFields.map(({ name, label }) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id={`user-${name}`}
                      inputId={`user-${name}`}
                      label={label}
                      required
                      disabled={disabled || isDenied(name)}
                      errorText={fieldState.error?.message}
                      width='large'
                    />
                  )}
                />
              ))}
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
            {editing && (
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
                  inputProps={{ 'aria-describedby': 'password-reset-unavailable' }}
                />
                <Button
                  type='button'
                  variant='contained'
                  disabled
                  aria-describedby='password-reset-unavailable'
                  sx={{ mt: 2 }}
                >
                  Reset Password
                </Button>
                <Typography id='password-reset-unavailable' variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                  Password reset is unavailable until API support is available.
                </Typography>
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
    </PaperLayout>
  )
}

export default function UsersCreateEditPage({ match: { params } }: RouteComponentProps<Params>): React.ReactElement {
  return <UserForm key={JSON.stringify([params.teamId, params.userId])} {...params} />
}
