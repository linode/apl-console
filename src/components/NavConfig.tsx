import SvgIconStyle from 'components/SvgIconStyle'

const getIcon = (name: string) => <SvgIconStyle src={`/assets/${name}`} sx={{ width: 1, height: 1 }} />

// You can add or pick icons from the /public/assets folder.
// Please use the naming convention [NAME]_icon.svg. Make sure
// it's SVG format.
const navConfig = [
  {
    subheader: 'actions',
    items: [
      { title: 'Deploy Changes', path: '/deploychanges', icon: getIcon('deploy_icon.svg') },
      { title: 'Revert Changes', path: '/revertchanges', icon: getIcon('revert_icon.svg') },
    ],
  },
  {
    subheader: 'admin',
    items: [
      { title: 'Dashboard', path: '/', icon: getIcon('dashboard_icon.svg') },
      { title: 'Apps', path: '/apps/admin', icon: getIcon('apps_icon.svg') },
      { title: 'Shortcuts', path: '/shortcuts/admin', icon: getIcon('shortcuts_icon.svg') },
      { title: 'Policies', path: '/policies', icon: getIcon('policies_icon.svg') },
      { title: 'Teams', path: '/teams', icon: getIcon('teams_icon.svg') },
      { title: 'Workloads', path: '/workloads', icon: getIcon('workloads_icon.svg') },
      { title: 'Services', path: '/services', icon: getIcon('services_icon.svg') },
      {
        title: 'Settings',
        path: '/settings',
        icon: getIcon('settings_icon.svg'),
      },
    ],
  },
  {
    subheader: 'team',
    items: [
      { title: 'Workloads', path: '/workloads', icon: getIcon('workloads_icon.svg') },
      { title: 'Services', path: '/services', icon: getIcon('services_icon.svg') },
    ],
  },
]

export default navConfig
