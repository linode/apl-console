import generateDownloadLink from 'generate-download-link'
import SvgIconStyle from 'components/SvgIconStyle'
import { useSession } from 'providers/Session'
import canDo from 'utils/permission'

const getIcon = (name: string) => <SvgIconStyle src={`/assets/${name}`} sx={{ width: 1, height: 1 }} />

// You can add or pick icons from the /public/assets folder.
// Please use the naming convention [NAME]_icon.svg. Make sure
// it's SVG format.

export default function NavConfig() {
  const { ca, appsEnabled, oboTeamId, user } = useSession()

  const downloadOpts = {
    data: ca ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = ca ? generateDownloadLink(downloadOpts) : ''
  const dashboard =
    oboTeamId !== 'admin' ? [{ title: 'Dashboard', path: '/', icon: getIcon('dashboard_icon.svg') }] : []

  return [
    {
      subheader: 'actions',
      items: [
        { title: 'Deploy Changes', path: '/deploychanges', icon: getIcon('deploy_icon.svg') },
        { title: 'Revert Changes', path: '/revertchanges', icon: getIcon('revert_icon.svg') },
      ],
    },
    {
      subheader: 'platform',
      items: [
        { title: 'Dashboard', path: '/', icon: getIcon('dashboard_icon.svg') },
        { title: 'Apps', path: '/apps/admin', icon: getIcon('apps_icon.svg') },
        { title: 'Shortcuts', path: '/shortcuts/admin', icon: getIcon('shortcuts_icon.svg') },
        { title: 'Policies', path: '/policies', icon: getIcon('policies_icon.svg') },
        { title: 'Teams', path: '/teams', icon: getIcon('teams_icon.svg') },
        { title: 'Projects', path: '/projects', icon: getIcon('projects_icon.svg') },
        { title: 'Builds', path: '/builds', icon: getIcon('builds_icon.svg') },
        { title: 'Workloads', path: '/workloads', icon: getIcon('workloads_icon.svg') },
        { title: 'Services', path: '/services', icon: getIcon('services_icon.svg') },
        { title: 'Backups', path: '/backups', icon: getIcon('backup_icon.svg') }, // replace .svg
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
        ...dashboard,
        { title: 'Apps', path: `/apps/${oboTeamId}`, icon: getIcon('apps_icon.svg'), dontShowIfAdminTeam: true },
        {
          title: 'Catalog',
          path: `/catalogs/${oboTeamId}`,
          icon: getIcon('developer_guide_icon.svg'),
        },
        {
          title: 'Shortcuts',
          path: `/shortcuts/${oboTeamId}`,
          icon: getIcon('shortcuts_icon.svg'),
          dontShowIfAdminTeam: true,
        },
        {
          title: 'Projects',
          path: `/teams/${oboTeamId}/projects`,
          icon: getIcon('projects_icon.svg'),
        },
        { title: 'Builds', path: `/teams/${oboTeamId}/builds`, icon: getIcon('builds_icon.svg') },
        { title: 'Secrets', path: `/teams/${oboTeamId}/secrets`, icon: getIcon('secrets_icon.svg') },
        { title: 'Workloads', path: `/teams/${oboTeamId}/workloads/`, icon: getIcon('workloads_icon.svg') },
        { title: 'Services', path: `/teams/${oboTeamId}/services`, icon: getIcon('services_icon.svg') },
        {
          title: 'Settings',
          path: `/teams/${oboTeamId}`,
          icon: getIcon('settings_icon.svg'),
          dontShowIfAdminTeam: true,
        },
        { title: 'Shell', path: `/cloudtty`, icon: getIcon('shell_icon.svg') },
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
          disabled: !canDo(user, oboTeamId, 'downloadDockerConfig') || !appsEnabled.harbor,
          isDownload: true,
        },
        {
          title: 'Download CA',
          path: `${anchor}`,
          icon: getIcon('download_icon.svg'),
          disabled: !ca,
          isDownload: true,
        },
      ],
    },
  ]
}
// export default navConfig
