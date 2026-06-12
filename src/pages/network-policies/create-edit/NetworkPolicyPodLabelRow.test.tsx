import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { useGetK8SPodLabelsForWorkloadQuery } from 'redux/otomiApi'
import NetworkPolicyPodLabelRow from './NetworkPolicyPodLabelRow'

jest.mock('redux/otomiApi', () => ({
  useGetK8SPodLabelsForWorkloadQuery: jest.fn(),
}))

jest.mock('components/forms/FormRow', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('components/forms/Autocomplete', () => ({
  Autocomplete: ({ label, options, value, onChange, groupBy, getOptionLabel }: any) => (
    <div>
      <div data-testid={`${label}-value`}>{typeof value === 'string' ? value : value?.name ?? value ?? ''}</div>

      <div data-testid={`${label}-options`}>
        {options.map((option: any) => {
          const optionLabel = getOptionLabel ? getOptionLabel(option) : option
          const optionGroup = groupBy ? groupBy(option) : undefined

          return (
            <button key={`${optionGroup ?? 'none'}-${optionLabel}`} type='button' onClick={() => onChange({}, option)}>
              {optionGroup ? `${optionGroup}/${optionLabel}` : optionLabel}
            </button>
          )
        })}
      </div>

      <button type='button' onClick={() => onChange({}, null)}>
        clear-{label}
      </button>
    </div>
  ),
}))

const mockUseGetK8SPodLabelsForWorkloadQuery = useGetK8SPodLabelsForWorkloadQuery as jest.Mock

const workloadOptions = [
  {
    metadata: {
      name: 'api',
      namespace: 'team-beta',
    },
  },
  {
    metadata: {
      name: 'frontend',
      namespace: 'team-alpha',
    },
  },
  {
    metadata: {
      name: 'backend',
      namespace: 'team-alpha',
    },
  },
] as any

function renderComponent(defaultAllowValue = {}) {
  function Wrapper() {
    const methods = useForm({
      defaultValues: {
        ruleType: {
          ingress: {
            allow: [
              {
                fromNamespace: '',
                fromLabelName: '',
                fromLabelValue: '',
                ...defaultAllowValue,
              },
            ],
          },
        },
      },
    })

    return (
      <FormProvider {...methods}>
        <NetworkPolicyPodLabelRow
          aplWorkloads={workloadOptions}
          teamId='team1'
          fieldArrayName='ruleType.ingress.allow.0'
          rowIndex={0}
        />

        <div data-testid='form-value'>{JSON.stringify(methods.watch('ruleType.ingress.allow.0'))}</div>
      </FormProvider>
    )
  }

  return render(<Wrapper />)
}

describe('NetworkPolicyPodLabelRow', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseGetK8SPodLabelsForWorkloadQuery.mockReturnValue({
      data: undefined,
    })
  })

  test('sorts workload options by namespace, then by name', () => {
    renderComponent()

    const renderedWorkloadOptions = screen.getByTestId('Workload-options')

    expect(renderedWorkloadOptions.textContent).toContain('team-alpha/backend')
    expect(renderedWorkloadOptions.textContent).toContain('team-alpha/frontend')
    expect(renderedWorkloadOptions.textContent).toContain('team-beta/api')

    expect(renderedWorkloadOptions.textContent).toMatch(/team-alpha\/backend.*team-alpha\/frontend.*team-beta\/api/)
  })

  test('does not fetch pod labels before a workload is selected', () => {
    renderComponent()

    expect(mockUseGetK8SPodLabelsForWorkloadQuery).toHaveBeenCalledWith(
      {
        teamId: 'team1',
        workloadName: '',
        namespace: '',
      },
      {
        skip: true,
      },
    )
  })

  test('fetches pod labels with workload name and namespace when workload is selected', async () => {
    renderComponent()

    fireEvent.click(screen.getByText('team-alpha/frontend'))

    await waitFor(() => {
      expect(mockUseGetK8SPodLabelsForWorkloadQuery).toHaveBeenLastCalledWith(
        {
          teamId: 'team1',
          workloadName: 'frontend',
          namespace: 'team-alpha',
        },
        {
          skip: false,
        },
      )
    })
  })

  test('shows pod label options from fetched pod labels', () => {
    mockUseGetK8SPodLabelsForWorkloadQuery.mockReturnValue({
      data: {
        'app.kubernetes.io/name': 'frontend',
        'apl.io/workload': 'frontend',
      },
    })

    renderComponent()

    expect(screen.getByText('app.kubernetes.io/name=frontend')).toBeTruthy()
    expect(screen.getByText('apl.io/workload=frontend')).toBeTruthy()
  })

  test('writes selected pod label to react-hook-form value with namespace', async () => {
    mockUseGetK8SPodLabelsForWorkloadQuery.mockReturnValue({
      data: {
        'app.kubernetes.io/name': 'frontend',
      },
    })

    renderComponent()

    fireEvent.click(screen.getByText('team-alpha/frontend'))
    fireEvent.click(screen.getByText('app.kubernetes.io/name=frontend'))

    await waitFor(() => {
      expect(screen.getByTestId('form-value').textContent).toBe(
        JSON.stringify({
          fromNamespace: 'team-alpha',
          fromLabelName: 'app.kubernetes.io/name',
          fromLabelValue: 'frontend',
        }),
      )
    })
  })
})
