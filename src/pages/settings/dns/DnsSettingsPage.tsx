import { MenuItem } from '@mui/material'
import Section from 'components/Section'
import { useSession } from 'providers/Session'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import {
  SettingsCheckbox,
  SettingsSelect,
  SettingsStringList,
  SettingsTextField,
  SettingsYamlField,
} from '../SettingsFields'

const initialProviders: Record<string, NonNullable<GetSettingsApiResponse['dns']>['provider']> = {
  '': null,
  akamai: { akamai: { host: '', accessToken: '', clientToken: '', clientSecret: '' } },
  aws: { aws: { region: '', credentials: {} } },
  azure: { azure: { resourceGroup: '', tenantId: '', subscriptionId: '', aadClientId: '', aadClientSecret: '' } },
  'azure-private-dns': {
    'azure-private-dns': { resourceGroup: '', tenantId: '', subscriptionId: '', aadClientId: '', aadClientSecret: '' },
  },
  cloudflare: { cloudflare: { proxied: true } },
  digitalocean: { digitalocean: {} },
  linode: { linode: {} },
  google: { google: { project: '' } },
  other: { other: { name: '', 'external-dns': {}, 'cert-manager': {} } },
}

function AzureDnsFields({ provider }: { provider: 'azure' | 'azure-private-dns' }) {
  return (
    <>
      <SettingsTextField name={`provider.${provider}.resourceGroup`} label='Resource group' />
      <SettingsTextField name={`provider.${provider}.hostedZoneName`} label='Hosted zone name' />
      <SettingsTextField name={`provider.${provider}.tenantId`} label='Tenant ID' />
      <SettingsTextField name={`provider.${provider}.subscriptionId`} label='Subscription ID' />
      <SettingsTextField name={`provider.${provider}.aadClientId`} label='Client ID' type='password' />
      <SettingsTextField name={`provider.${provider}.aadClientSecret`} label='Client secret' type='password' />
    </>
  )
}

export default function DnsSettingsPage() {
  const form = useSettingsForm('dns')
  const { settings } = useSession()
  const current = form.methods.watch('provider')
  const provider = Object.keys(initialProviders).find((key) => current && key in current) ?? ''
  return (
    <SettingsForm
      {...form}
      title='DNS'
      disabled={settings.otomi.isPreInstalled}
      message={
        settings.otomi.isPreInstalled
          ? 'These settings can not be changed when installed by Akamai Connected Cloud.'
          : undefined
      }
    >
      <Section title='Zones and filters' description='Configure the DNS zones this cluster can administer.'>
        <SettingsStringList name='zones' label='Zone' />
        <SettingsStringList name='domainFilters' label='Domain filter' />
        <SettingsStringList name='zoneIdFilters' label='Zone ID filter' />
      </Section>
      <Section title='DNS provider'>
        <SettingsSelect
          label='Provider'
          value={provider}
          onChange={(value) => {
            if (!(value in initialProviders)) throw new Error(`Unknown DNS provider: ${value}`)
            form.methods.setValue('provider', initialProviders[value], { shouldDirty: true })
          }}
        >
          <MenuItem value=''>None</MenuItem>
          <MenuItem value='akamai'>Akamai</MenuItem>
          <MenuItem value='aws'>AWS</MenuItem>
          <MenuItem value='azure'>Azure</MenuItem>
          <MenuItem value='azure-private-dns'>Azure Private DNS</MenuItem>
          <MenuItem value='cloudflare'>CloudFlare</MenuItem>
          <MenuItem value='digitalocean'>Digital Ocean</MenuItem>
          <MenuItem value='linode'>Linode</MenuItem>
          <MenuItem value='google'>Google</MenuItem>
          <MenuItem value='other'>Other</MenuItem>
        </SettingsSelect>
        {provider === 'akamai' && (
          <>
            <SettingsTextField name='provider.akamai.host' label='Akamai API host' />
            <SettingsTextField name='provider.akamai.accessToken' label='Access token' type='password' />
            <SettingsTextField name='provider.akamai.clientToken' label='Client token' type='password' />
            <SettingsTextField name='provider.akamai.clientSecret' label='Client secret' type='password' />
          </>
        )}
        {provider === 'aws' && (
          <>
            <SettingsTextField name='provider.aws.region' label='Region' />
            <SettingsTextField name='provider.aws.role' label='Role' />
            <SettingsTextField name='provider.aws.credentials.accessKey' label='Access key' type='password' />
            <SettingsTextField name='provider.aws.credentials.secretKey' label='Secret key' type='password' />
          </>
        )}
        {provider === 'azure' && <AzureDnsFields provider='azure' />}
        {provider === 'azure-private-dns' && <AzureDnsFields provider='azure-private-dns' />}
        {provider === 'cloudflare' && (
          <>
            <SettingsTextField name='provider.cloudflare.apiToken' label='API token' type='password' />
            <SettingsTextField name='provider.cloudflare.apiSecret' label='API secret' type='password' />
            <SettingsTextField name='provider.cloudflare.email' label='Email' />
            <SettingsCheckbox name='provider.cloudflare.proxied' label='Proxied' />
          </>
        )}
        {provider === 'digitalocean' && (
          <SettingsTextField name='provider.digitalocean.apiToken' label='API token' type='password' />
        )}
        {provider === 'linode' && (
          <SettingsTextField name='provider.linode.apiToken' label='API token' type='password' />
        )}
        {provider === 'google' && (
          <>
            <SettingsTextField name='provider.google.project' label='Project' />
            <SettingsTextField name='provider.google.serviceAccountKey' label='Service account key' type='password' />
          </>
        )}
        {provider === 'other' && (
          <>
            <SettingsTextField name='provider.other.name' label='Provider name' />
            <SettingsYamlField name='provider.other.external-dns' label='YAML for external-dns' />
            <SettingsYamlField name='provider.other.cert-manager' label='YAML for cert-manager' />
          </>
        )}
      </Section>
    </SettingsForm>
  )
}
