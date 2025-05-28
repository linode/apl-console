import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { TextField } from 'components/forms/TextField'
import KeyValue from 'components/KeyValue'
import { AutoResizableTextarea } from 'components/TextArea'
import { secretTypes } from './create-edit-secrets.validator'

/**
 * Renders the secret-specific form fields based on selected secret type.
 * Expects encryptedData to be part of form schema.
 */
export function SecretTypeFields({ namePrefix = '' }: { namePrefix?: string }) {
  const { control, register } = useFormContext()
  const typePath = namePrefix ? `${namePrefix}.type` : 'type'
  const dataPath = namePrefix ? `${namePrefix}.encryptedData` : 'encryptedData'
  const selectedType = useWatch({ control, name: typePath }) as secretTypes

  switch (selectedType) {
    case 'kubernetes.io/opaque':
      return <KeyValue name={dataPath} keyLabel='key' valueLabel='value' addLabel='Add another' isTextArea />

    case 'kubernetes.io/service-account-token':
    case 'kubernetes.io/dockercfg':
    case 'kubernetes.io/ssh-auth':
      return (
        <>
          <TextField label='Key' {...register(`${dataPath}[0].key`)} />
          <TextField label='Value' {...register(`${dataPath}[0].value`)} />
        </>
      )

    case 'kubernetes.io/dockerconfigjson':
    case 'kubernetes.io/tls':
      return (
        <>
          <TextField label='Key' {...register(`${dataPath}[0].key`)} />
          <AutoResizableTextarea {...register(`${dataPath}[0].value`)} placeholder='Paste JSON or certificate here' />
        </>
      )

    case 'kubernetes.io/basic-auth':
      return (
        <>
          <TextField label='Username' {...register(`${dataPath}[0].key`)} />
          <TextField label='Password' type='password' {...register(`${dataPath}[0].value`)} />
        </>
      )

    default:
      return null
  }
}
