import { Box, Button, Typography } from '@mui/material'
import { LandingHeader } from 'components/LandingHeader'
import InformationBanner from 'components/InformationBanner'
import PaperLayout from 'layouts/Paper'
import { isEqual } from 'lodash'
import { useSession } from 'providers/Session'
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { FieldValues, FormProvider, UseFormReturn, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { GetSettingsApiResponse, useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
import snack from 'utils/snack'
import { defaultsForSchema } from './settings-schema'
import { getSettingsSchema, settingsPayload, settingsResolver } from './settings.validator'

export type SettingsId = Exclude<keyof GetSettingsApiResponse, 'otomi'>
export const SettingsDisabledContext = createContext(false)

export function SettingsFieldset({ disabled, children }: { disabled?: boolean; children: React.ReactNode }) {
  const inherited = useContext(SettingsDisabledContext)
  const isDisabled = inherited || Boolean(disabled)
  return (
    <SettingsDisabledContext.Provider value={isDisabled}>
      <Box component='fieldset' disabled={isDisabled} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        {children}
      </Box>
    </SettingsDisabledContext.Provider>
  )
}

export function useSettingsForm<K extends SettingsId>(settingId: K) {
  type Values = NonNullable<GetSettingsApiResponse[K]>
  const history = useHistory()
  const { refetchSettings } = useSession()
  const query = useGetSettingsQuery({ ids: [settingId, 'obj'] })
  const [edit, { isLoading: isUpdating }] = useEditSettingsMutation()
  const schema = useMemo(() => getSettingsSchema(settingId), [settingId])
  const resolver = useMemo(() => settingsResolver<Values>(schema), [schema])
  const methods = useForm<Values>({
    resolver,
  })
  const { reset } = methods
  const previous = useRef<{ value: unknown }>()
  useEffect(() => {
    if (!query.data || (previous.current && isEqual(previous.current.value, query.data[settingId]))) return
    previous.current = { value: query.data[settingId] }
    // The API schema supplies defaults, but never determines which controls are rendered.
    reset(defaultsForSchema(schema, query.data[settingId] ?? {}) as Values)
  }, [query.data, schema, settingId, reset])

  const isDirty = useAppSelector(({ global }) => global.isDirty)
  useEffect(() => {
    if (isDirty === false && !query.isFetching) query.refetch()
  }, [isDirty])

  const onSubmit = async (values: Values) => {
    const result = await edit({ settingId, body: { [settingId]: settingsPayload(values, schema) } })
    if ('error' in result) {
      snack.error('Unable to save settings. Please try again.')
      return
    }
    reset(values)
    query.refetch()
    refetchSettings()
    snack.success('Settings saved successfully')
    history.push('/settings')
  }
  return {
    methods,
    onSubmit,
    loading: query.isLoading,
    fetching: query.isFetching,
    mutating: isUpdating,
    error: query.isError,
    docsLink: schema['x-externalDocsPath']
      ? `https://techdocs.akamai.com/app-platform/docs/${schema['x-externalDocsPath']}`
      : undefined,
    data: query.data,
  }
}

interface Props<T extends FieldValues> {
  title: string
  methods: UseFormReturn<T>
  onSubmit: (values: T) => Promise<void>
  loading?: boolean
  fetching?: boolean
  saveBlocked?: boolean
  mutating?: boolean
  disabled?: boolean
  error?: boolean
  docsLink?: string
  message?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export default function SettingsForm<T extends FieldValues>({
  title,
  methods,
  onSubmit,
  loading,
  fetching,
  saveBlocked,
  mutating,
  disabled,
  error,
  docsLink,
  message,
  action,
  children,
}: Props<T>) {
  const history = useHistory()
  const { isDirty, isSubmitting, errors } = methods.formState
  const blocked = disabled || error || fetching || saveBlocked || mutating || isSubmitting
  const comp = (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={(event) => {
          if (blocked) {
            event.preventDefault()
            return
          }
          methods.handleSubmit(onSubmit)(event)
        }}
      >
        <LandingHeader title={title} docsLink={docsLink} />
        {error && <InformationBanner message='Unable to load settings. Please try again.' />}
        {message && <InformationBanner message={message}>{action}</InformationBanner>}
        <SettingsFieldset disabled={disabled || error || mutating || isSubmitting}>{children}</SettingsFieldset>
        {errors.root?.message && <Typography color='error'>{String(errors.root.message)}</Typography>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button type='button' onClick={() => history.push('/settings')}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' disabled={blocked || !isDirty}>
            Save Changes
          </Button>
        </Box>
      </form>
    </FormProvider>
  )
  return <PaperLayout comp={comp} loading={loading} title={`${title} settings`} />
}
