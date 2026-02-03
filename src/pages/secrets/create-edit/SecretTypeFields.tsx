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
  const typePath = namePrefix ? `${namePrefix}.template.type` : 'spec.template.type'
  const dataPath = namePrefix ? `${namePrefix}.encryptedData` : 'spec.encryptedData'
  const selectedType = useWatch({ control, name: typePath }) as typeof secretTypes[number]
  const title = 'Secret Data'
  const disabled = immutable && { keyDisabled: true, valueDisabled: true, disabled: true }

  switch (selectedType) {
    case 'kubernetes.io/opaque':
      return (
        <KeyValue
          title={title}
          subTitle='Add arbitrary key-value data.'
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
      return (
        <KeyValue
          title={title}
          subTitle='Add contents from a serialized ~/.dockercfg file.'
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
    case 'kubernetes.io/dockerconfigjson':
      return (
        <KeyValue
          title={title}
          subTitle='Add contents from a serialized ~/.docker/config.json file.'
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
    case 'kubernetes.io/ssh-auth':
      return (
        <KeyValue
          title={title}
          subTitle='Add credentials for SSH authentication.'
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
    case 'kubernetes.io/tls':
      return (
        <KeyValue
          title={title}
          subTitle='Add the data for a TLS client or server.'
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
          subTitle='Add credentials (username and password) for basic authentication.'
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
