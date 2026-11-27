import React from 'react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { GetAplTeamApiResponse } from 'redux/otomiApi'
import palette from '../theme/palette'
import Apps from './Apps'

jest.mock('providers/Session', () => ({ useSession: () => ({}) }))
jest.mock('utils/data', () => ({
  getAppData: (_session, teamId, app) => ({
    ...app,
    externalUrl: `https://${app.id}-${teamId}.example.com/`,
  }),
}))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('./Iconify', () => () => null)
jest.mock('./TableToolbar', () => () => null)
jest.mock('./Modal', () => () => null)
jest.mock('./ObjAppModal', () => () => null)
jest.mock('./DeprecatedModalInfo', () => () => null)

const theme = createTheme({ palette: palette.light } as ThemeOptions)
theme.font = { normal: 'sans-serif', bold: 'sans-serif' }

function renderApps(
  teamId: string,
  monitoring: GetAplTeamApiResponse['spec']['managedMonitoring'],
  platformGrafanaEnabled = false,
) {
  const teamSettings: GetAplTeamApiResponse = {
    kind: 'AplTeamSettingSet',
    spec: { managedMonitoring: monitoring },
    metadata: { name: teamId, labels: { 'apl.io/teamId': teamId } },
    status: {},
  }
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Apps
          teamId={teamId}
          apps={[
            { id: 'grafana', enabled: platformGrafanaEnabled },
            { id: 'alertmanager', enabled: false },
            { id: 'other', enabled: false },
            { id: 'loki', enabled: true },
          ]}
          teamSettings={teamSettings}
          objSettings={{}}
          setAppState={jest.fn()}
        />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('team managed monitoring apps', () => {
  it('shows a working Grafana link when enabled for the team but disabled on the platform', () => {
    renderApps('alpha', { grafana: true, alertmanager: true })

    expect(screen.getByRole('link', { name: /grafana/i })).toHaveAttribute('href', 'https://grafana-alpha.example.com/')
    expect(screen.getByRole('link', { name: /alertmanager/i })).toHaveAttribute(
      'href',
      'https://alertmanager-alpha.example.com/',
    )
    expect(screen.queryByText('other')).not.toBeInTheDocument()
  })

  it('hides Grafana and its Loki dashboard when team Grafana is disabled, even if platform Grafana is enabled', () => {
    renderApps('alpha', { grafana: false, alertmanager: false }, true)

    expect(screen.queryByText('grafana')).not.toBeInTheDocument()
    expect(screen.queryByText('loki')).not.toBeInTheDocument()
    expect(screen.queryByText('alertmanager')).not.toBeInTheDocument()
  })

  it('does not enable the platform Grafana app from team settings', () => {
    renderApps('admin', { grafana: true })

    expect(screen.getByText('grafana').closest('a')).toHaveStyle({ pointerEvents: 'none' })
  })
})
