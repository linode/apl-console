import { MenuItem } from '@mui/material'
import Section from 'components/Section'
import { useSession } from 'providers/Session'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsSelect, SettingsTextField } from '../SettingsFields'

export default function KmsSettingsPage() {
  const form = useSettingsForm('kms')
  const { settings } = useSession()
  const sops = form.methods.watch('sops')
  const provider = sops && 'provider' in sops ? sops.provider : ''
  return (
    <SettingsForm
      {...form}
      title='Secrets'
      disabled={settings.otomi.isPreInstalled}
      message={
        settings.otomi.isPreInstalled
          ? 'These settings can not be changed when installed by Akamai Connected Cloud.'
          : undefined
      }
    >
      <Section title='SOPS configuration' description='Select the encryption engine used to encrypt platform secrets.'>
        <SettingsSelect
          label='SOPS provider'
          value={provider ?? ''}
          onChange={(value) => {
            const providers: Record<string, NonNullable<GetSettingsApiResponse['kms']>['sops']> = {
              '': null,
              age: { provider: 'age' as const, age: { publicKey: '', privateKey: '' } },
              aws: { provider: 'aws' as const, aws: { keys: '', accessKey: '', secretKey: '' } },
              azure: { provider: 'azure' as const, azure: { keys: '', clientId: '', clientSecret: '' } },
              google: { provider: 'google' as const, google: { keys: '', accountJson: '', project: '' } },
            }
            if (!(value in providers)) throw new Error(`Unknown SOPS provider: ${value}`)
            form.methods.setValue('sops', providers[value], { shouldDirty: true })
          }}
        >
          <MenuItem value=''>None</MenuItem>
          <MenuItem value='age'>Age</MenuItem>
          <MenuItem value='aws'>AWS KMS</MenuItem>
          <MenuItem value='azure'>Azure Keyvault</MenuItem>
          <MenuItem value='google'>Google KMS</MenuItem>
        </SettingsSelect>
      </Section>
      {provider === 'age' && (
        <Section title='Age configuration'>
          <SettingsTextField name='sops.age.publicKey' label='Public key' disabled />
          <SettingsTextField name='sops.age.privateKey' label='Private key' type='password' disabled />
        </Section>
      )}
      {provider === 'aws' && (
        <Section title='AWS configuration'>
          <SettingsTextField
            name='sops.aws.keys'
            label='AWS KMS keys'
            helperText='Comma-separated ARNs for encryption and decryption keys.'
          />
          <SettingsTextField name='sops.aws.accessKey' label='Access key' type='password' />
          <SettingsTextField name='sops.aws.secretKey' label='Secret key' type='password' />
          <SettingsTextField name='sops.aws.region' label='Region' />
        </Section>
      )}
      {provider === 'azure' && (
        <Section title='Azure configuration'>
          <SettingsTextField name='sops.azure.keys' label='Azure Keyvault keys' />
          <SettingsTextField name='sops.azure.clientId' label='Client ID' type='password' />
          <SettingsTextField name='sops.azure.clientSecret' label='Client secret' type='password' />
          <SettingsTextField name='sops.azure.tenantId' label='Tenant ID' />
        </Section>
      )}
      {provider === 'google' && (
        <Section title='Google configuration'>
          <SettingsTextField name='sops.google.keys' label='Google KMS keys' />
          <SettingsTextField name='sops.google.accountJson' label='Service account JSON' type='password' />
          <SettingsTextField name='sops.google.project' label='Project' />
        </Section>
      )}
    </SettingsForm>
  )
}
