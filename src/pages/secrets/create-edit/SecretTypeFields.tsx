import { useFormContext, useWatch } from 'react-hook-form'
import KeyValue from 'components/forms/KeyValue'
import { secretTypes } from './create-edit-secrets.validator'
/**
 * Renders the secret-specific form fields based on selected secret type.
 * Expects encryptedData to be part of form schema.
 */
export function SecretTypeFields({ namePrefix = '' }: { namePrefix?: string }) {
  const { control } = useFormContext()
  const typePath = namePrefix ? `${namePrefix}.type` : 'type'
  const dataPath = namePrefix ? `${namePrefix}.encryptedData` : 'encryptedData'
  const selectedType = useWatch({ control, name: typePath }) as typeof secretTypes[number]

  switch (selectedType) {
    case 'kubernetes.io/opaque':
      return <KeyValue title='' name={dataPath} keyLabel='Key' valueLabel='Value' addLabel='Add another' isTextArea />
    case 'kubernetes.io/service-account-token':
    case 'kubernetes.io/dockercfg':
    case 'kubernetes.io/dockerconfigjson':
    case 'kubernetes.io/ssh-auth':
    case 'kubernetes.io/tls':
      return <KeyValue title='' name={dataPath} keyDisabled keyLabel='Key' valueLabel='Value' isTextArea />
    case 'kubernetes.io/basic-auth':
      return <KeyValue title='' keyDisabled name={dataPath} keyLabel='Key' valueLabel='Value' />
    default:
      return null
  }
}
