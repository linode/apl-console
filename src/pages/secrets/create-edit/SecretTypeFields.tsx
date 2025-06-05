import { useFormContext, useWatch } from 'react-hook-form'
import KeyValue from 'components/forms/KeyValue'
import { secretTypes } from './create-edit-secrets.validator'
/**
 * Renders the secret-specific form fields based on selected secret type.
 * Expects encryptedData to be part of form schema.
 */
export function SecretTypeFields({
  namePrefix = '',
  immutable = false,
  error,
  helperText,
  isEncrypted,
}: {
  namePrefix?: string
  immutable?: boolean
  error?: boolean
  helperText?: string
  isEncrypted?: boolean
}) {
  const { control } = useFormContext()
  const typePath = namePrefix ? `${namePrefix}.type` : 'type'
  const dataPath = namePrefix ? `${namePrefix}.encryptedData` : 'encryptedData'
  const selectedType = useWatch({ control, name: typePath }) as typeof secretTypes[number]
  const title = 'Encrypted Data'
  const disabled = immutable && { keyDisabled: true, valueDisabled: true, disabled: true }

  switch (selectedType) {
    case 'kubernetes.io/opaque':
      return (
        <KeyValue
          title={title}
          subTitle='A Kubernetes Opaque Secret is simply the "generic" secret type—perfect any time you need to stash arbitrary key-value data that doesn’t fit one of the built‐in types'
          name={dataPath}
          keyLabel='Key'
          valueLabel='Value'
          showLabel={false}
          compressed
          addLabel='Add another'
          error={error}
          helperText={helperText}
          isEncrypted={isEncrypted}
          isTextArea
          {...disabled}
        />
      )
    case 'kubernetes.io/dockercfg':
    case 'kubernetes.io/dockerconfigjson':
    case 'kubernetes.io/ssh-auth':
    case 'kubernetes.io/tls':
      return (
        <KeyValue
          title={title}
          subTitle={`Enter key-value pairs for the "${selectedType}" secret type`}
          name={dataPath}
          keyDisabled
          keyLabel='Key'
          valueLabel='Value'
          showLabel={false}
          compressed
          error={error}
          helperText={helperText}
          isEncrypted={isEncrypted}
          isTextArea
          {...disabled}
        />
      )
    case 'kubernetes.io/basic-auth':
      return (
        <KeyValue
          title={title}
          subTitle='Basic-auth Secret exists out of a username and password'
          keyDisabled
          name={dataPath}
          keyLabel='Key'
          valueLabel='Value'
          showLabel={false}
          compressed
          error={error}
          isEncrypted={isEncrypted}
          helperText={helperText}
          isTextArea
          {...disabled}
        />
      )
    default:
      return null
  }
}
