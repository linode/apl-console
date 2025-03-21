import generateDownloadLink from 'generate-download-link'
import SvgIconStyle from 'components/SvgIconStyle'
import { useSession } from 'providers/Session'
import { canDo } from 'utils/permission'

const getIcon = (name: string) => <SvgIconStyle src={`/assets/${name}`} sx={{ width: 1, height: 1 }} />

// You can add or pick icons from the /public/assets folder.
// Please use the naming convention [NAME]_icon.svg. Make sure
// it's SVG format.

export default function NavConfig() {
  const { ca, appsEnabled, oboTeamId, user, settings } = useSession()
  const hasExternalIDP = settings?.otomi?.hasExternalIDP ?? false
  const isManaged = settings?.otomi?.isPreInstalled ?? false
  const downloadOpts = {
    data: ca ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = ca ? generateDownloadLink(downloadOpts) : ''
  return [
    {
      subheader: 'platform',
      items: [
        { title: 'Dashboard', path: '/', icon: getIcon('dashboard_icon.svg') },
        { title: 'Apps', path: '/apps/admin', icon: getIcon('apps_icon.svg') },
        // { title: 'Policies', path: '/policies', icon: getIcon('policies_icon.svg') },
        { title: 'Teams', path: '/teams', icon: getIcon('teams_icon.svg') },
        { title: 'User Management', path: '/users', icon: getIcon('users_icon.svg'), hidden: hasExternalIDP },
        { title: 'Projects', path: '/projects', icon: getIcon('projects_icon.svg') },
        { title: 'Code Repositories', path: '/coderepositories', icon: getIcon('coderepositories_icon.svg') },
        { title: 'Container Images', path: '/container-images', icon: getIcon('builds_icon.svg') },
        { title: 'Workloads', path: '/workloads', icon: getIcon('workloads_icon.svg') },
        { title: 'Network Policies', path: '/netpols', icon: getIcon('policies_icon.svg') },
        { title: 'Services', path: '/services', icon: getIcon('services_icon.svg') },
        { title: 'Backups', path: '/backups', icon: getIcon('backup_icon.svg'), hidden: isManaged }, // replace .svg
        { title: 'Maintenance', path: '/maintenance', icon: getIcon('maintenance_icon.svg') }, // replace .svg
        {
          title: 'Settings',
          path: '/settings',
          icon: getIcon('settings_icon.svg'),
        },
      ],
    },
    {
      subheader: `Team ${oboTeamId}`,
      items: [
        { title: 'Dashboard', path: '/', icon: getIcon('dashboard_icon.svg'), hidden: oboTeamId === 'admin' },
        { title: 'Apps', path: `/apps/${oboTeamId}`, icon: getIcon('apps_icon.svg'), hidden: oboTeamId === 'admin' },
        {
          title: 'Catalog',
          path: `/catalogs/${oboTeamId}`,
          icon: getIcon('developer_guide_icon.svg'),
        },
        {
          title: 'Projects',
          path: `/teams/${oboTeamId}/projects`,
          icon: getIcon('projects_icon.svg'),
        },
        {
          title: 'Code Repositories',
          path: `/teams/${oboTeamId}/coderepositories`,
          icon: getIcon('coderepositories_icon.svg'),
        },
        { title: 'Container Images', path: `/teams/${oboTeamId}/container-images`, icon: getIcon('builds_icon.svg') },
        { title: 'Sealed Secrets', path: `/teams/${oboTeamId}/sealed-secrets`, icon: getIcon('shield_lock_icon.svg') },
        { title: 'Workloads', path: `/teams/${oboTeamId}/workloads/`, icon: getIcon('workloads_icon.svg') },
        { title: 'Network Policies', path: `/teams/${oboTeamId}/netpols/`, icon: getIcon('policies_icon.svg') },
        { title: 'Services', path: `/teams/${oboTeamId}/services`, icon: getIcon('services_icon.svg') },
        { title: 'Security Policies', path: `/teams/${oboTeamId}/policies`, icon: getIcon('security_icon.svg') },
        {
          title: 'User Management',
          path: `/teams/${oboTeamId}/users`,
          icon: getIcon('users_icon.svg'),
          hidden: hasExternalIDP || !(user.isPlatformAdmin || user.isTeamAdmin) || oboTeamId === 'admin',
        },
        {
          title: 'Settings',
          path: `/teams/${oboTeamId}`,
          icon: getIcon('settings_icon.svg'),
          hidden: oboTeamId === 'admin',
        },
      ],
    },
    {
      subheader: 'Access',
      items: [
        {
          title: 'Shell',
          path: `/cloudtty`,
          icon: getIcon('shell_icon.svg'),
          disabled: process.env.NODE_ENV !== 'production' || !canDo(user, oboTeamId, 'shell'),
        },
        {
          title: 'Download KUBECFG',
          path: `/api/v1/kubecfg/${oboTeamId}`,
          icon: getIcon('download_icon.svg'),
          disabled: oboTeamId === 'admin' || !canDo(user, oboTeamId, 'downloadKubeConfig'),
          isDownload: true,
        },
        {
          title: 'Download DOCKERCFG',
          path: `/api/v1/dockerconfig/${oboTeamId}`,
          icon: getIcon('download_icon.svg'),
          disabled: !appsEnabled?.harbor || !canDo(user, oboTeamId, 'downloadDockerConfig'),
          isDownload: true,
        },
        {
          title: 'Download CA',
          path: `${anchor}`,
          icon: getIcon('download_icon.svg'),
          disabled: !ca || !canDo(user, oboTeamId, 'downloadCertificateAuthority') || isManaged,
          isDownload: isManaged,
          hidden: isManaged,
        },
      ],
    },
  ]
}
