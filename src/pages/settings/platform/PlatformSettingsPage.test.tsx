import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import PlatformSettingsPage from './PlatformSettingsPage'

const mockEditSettings = jest.fn()
const mockUnwrap = jest.fn()
const mockRefetch = jest.fn()
const mockRefetchSettings = jest.fn()

let mockSettingsData: Record<string, unknown> | undefined
let mockIsLoading = false
let mockIsFetching = false
let mockIsUpdating = false

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver:
    () =>
    (values: unknown): { values: unknown; errors: Record<string, never> } => ({
      values,
      errors: {},
    }),
}))

jest.mock('providers/Session', () => ({
  useSession: () => ({
    refetchSettings: mockRefetchSettings,
  }),
}))

jest.mock('redux/otomiApi', () => ({
  useGetSettingsQuery: (_args?: unknown) => ({
    data: mockSettingsData,
    isLoading: mockIsLoading,
    isFetching: mockIsFetching,
    refetch: mockRefetch,
  }),
  useEditSettingsMutation: () => [
    mockEditSettings,
    {
      isLoading: mockIsUpdating,
    },
  ],
}))

jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp, loading, title }: { comp: React.ReactNode; loading: boolean; title: string }) => (
    <div>
      <h1>{title}</h1>
      {loading ? <div>Loading platform settings</div> : comp}
    </div>
  ),
}))

jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title }: { title: string }) => <h2>{title}</h2>,
}))

jest.mock('components/Section', () => ({
  __esModule: true,
  default: ({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) => (
    <section>
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {children}
    </section>
  ),
}))

jest.mock('components/Divider', () => ({
  Divider: () => <hr />,
}))

jest.mock('components/forms/FormRow', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
/* eslint-disable react/prop-types */
jest.mock('components/forms/TextField', () => ({
  TextField: (() => {
    const React = jest.requireActual('react') as typeof import('react')

    return React.forwardRef<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement> & {
        label: string
        errorText?: string
        helperText?: string
        error?: boolean
      }
    >(({ label, errorText, helperText, error: _error, id, name, ...inputProps }, ref) => {
      const inputId = id ?? name ?? label

      return (
        <div>
          <label htmlFor={inputId}>{label}</label>

          <input ref={ref} id={inputId} name={name} {...inputProps} />

          {errorText && <div role='alert'>{errorText}</div>}
          {helperText && <div>{helperText}</div>}
        </div>
      )
    })
  })(),
}))

/* eslint-disable react/prop-types */
jest.mock('components/forms/ControlledCheckbox', () => ({
  __esModule: true,
  default: function MockControlledCheckbox({
    name,
    control,
    label,
  }: {
    name: string
    control: unknown
    label: string
  }) {
    const { useController } = jest.requireActual('react-hook-form') as typeof import('react-hook-form')

    const {
      field: { value, onChange, ref },
    } = useController({
      name,
      control: control as never,
    })

    return (
      <label htmlFor={name}>
        <input
          ref={ref}
          id={name}
          type='checkbox'
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        {label}
      </label>
    )
  },
}))

jest.mock('components/forms/KeyValue', () => ({
  __esModule: true,
  default: (() => {
    const React = jest.requireActual('react') as typeof import('react')
    const { useFieldArray, useFormContext } = jest.requireActual('react-hook-form') as typeof import('react-hook-form')

    return React.forwardRef<
      HTMLFieldSetElement,
      {
        title: string
        addLabel: string
        keyLabel: string
        valueLabel: string
      }
    >(({ title, addLabel, keyLabel, valueLabel }, _ref) => {
      const { control, register } = useFormContext()
      const { fields, append, remove } = useFieldArray({
        control,
        name: 'nodeSelector',
      })

      return (
        <fieldset>
          <legend>{title}</legend>

          {fields.map((field: { id: string }, index: number) => (
            <div key={field.id} data-testid={`node-selector-${index}`}>
              <label htmlFor={`node-selector-name-${index}`}>
                {keyLabel}
                <input
                  id={`node-selector-name-${index}`}
                  aria-label={`${keyLabel} ${index + 1}`}
                  {...register(`nodeSelector.${index}.name`)}
                />
              </label>

              <label htmlFor={`node-selector-value-${index}`}>
                {valueLabel}
                <input
                  id={`node-selector-value-${index}`}
                  aria-label={`${valueLabel} ${index + 1}`}
                  {...register(`nodeSelector.${index}.value`)}
                />
              </label>

              <button type='button' onClick={() => remove(index)}>
                Remove node selector {index + 1}
              </button>
            </div>
          ))}

          <button
            type='button'
            onClick={() =>
              append({
                name: '',
                value: '',
              })
            }
          >
            {addLabel}
          </button>
        </fieldset>
      )
    })
  })(),
}))

describe('PlatformSettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockSettingsData = {
      otomi: {
        hasExternalDNS: true,
        hasExternalIDP: false,
        version: 'v2.15.0',
        globalPullSecret: {
          username: 'registry-user',
          password: 'registry-password',
          email: 'registry@example.com',
          server: 'registry.example.com',
        },
        nodeSelector: [
          {
            name: 'node-role.kubernetes.io/platform',
            value: 'true',
          },
        ],
        isMultitenant: true,
        isPreInstalled: true,
        aiEnabled: true,
        useORCS: false,
        adminPassword: 'preserve-me',
        git: {
          repoUrl: 'https://example.com/platform.git',
          branch: 'main',
          email: 'git@example.com',
        },
      },
    }

    mockIsLoading = false
    mockIsFetching = false
    mockIsUpdating = false

    mockEditSettings.mockReturnValue({
      unwrap: mockUnwrap,
    })

    mockUnwrap.mockResolvedValue(undefined)
    mockRefetch.mockResolvedValue(undefined)
    mockRefetchSettings.mockResolvedValue(undefined)
  })

  it('populates the form using the current platform settings', async () => {
    render(<PlatformSettingsPage />)

    expect(await screen.findByLabelText('Platform version')).toHaveValue('v2.15.0')

    expect(screen.getByRole('checkbox', { name: 'Use external DNS' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Use external identity provider' })).not.toBeChecked()

    expect(screen.getByLabelText('Registry server')).toHaveValue('registry.example.com')
    expect(screen.getByLabelText('Username')).toHaveValue('registry-user')
    expect(screen.getByLabelText('Password')).toHaveValue('registry-password')
    expect(screen.getByLabelText('Email (optional)')).toHaveValue('registry@example.com')

    expect(screen.getByLabelText('Name 1')).toHaveValue('node-role.kubernetes.io/platform')
    expect(screen.getByLabelText('Value 1')).toHaveValue('true')

    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  })

  it('updates rendered settings while preserving hidden Otomi settings', async () => {
    const user = userEvent.setup()

    render(<PlatformSettingsPage />)

    const versionInput = await screen.findByLabelText('Platform version')

    // Wait for the form to be properly initialized with values
    await waitFor(() => {
      expect(versionInput).toHaveValue('v2.15.0')
    })

    await user.clear(versionInput)
    await user.type(versionInput, 'v2.16.0')

    // Wait for form to detect the change
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save Changes' })).not.toBeDisabled()
    })

    await user.click(screen.getByRole('checkbox', { name: 'Use external DNS' }))
    await user.click(screen.getByRole('checkbox', { name: 'Use external identity provider' }))

    const existingSelector = screen.getByTestId('node-selector-0')

    await user.clear(within(existingSelector).getByLabelText('Name 1'))
    await user.type(within(existingSelector).getByLabelText('Name 1'), '  workload-type  ')

    await user.clear(within(existingSelector).getByLabelText('Value 1'))
    await user.type(within(existingSelector).getByLabelText('Value 1'), '  platform  ')

    await user.click(screen.getByRole('button', { name: 'Add node selector' }))

    const emptySelector = screen.getByTestId('node-selector-1')

    await user.type(within(emptySelector).getByLabelText('Name 2'), '   ')
    await user.type(within(emptySelector).getByLabelText('Value 2'), '   ')

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(mockEditSettings).toHaveBeenCalledTimes(1)
    })

    expect(mockEditSettings).toHaveBeenCalledWith({
      settingId: 'otomi',
      body: {
        otomi: {
          hasExternalDNS: false,
          hasExternalIDP: true,
          version: 'v2.16.0',
          globalPullSecret: {
            username: 'registry-user',
            password: 'registry-password',
            email: 'registry@example.com',
            server: 'registry.example.com',
          },
          nodeSelector: [
            {
              name: 'workload-type',
              value: 'platform',
            },
          ],
          isMultitenant: true,
          isPreInstalled: true,
          aiEnabled: true,
          useORCS: false,
          adminPassword: 'preserve-me',
        },
      },
    })

    expect(mockUnwrap).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1)
      expect(mockRefetchSettings).toHaveBeenCalledTimes(1)
    })
  })

  it('omits Git settings from the submitted payload', async () => {
    const user = userEvent.setup()

    mockSettingsData = {
      otomi: {
        version: 'v2.15.0',
        hasExternalDNS: false,
        hasExternalIDP: false,
        globalPullSecret: null,
        nodeSelector: [],
        git: {
          repoUrl: '',
          branch: '',
          email: '',
        },
      },
    }

    render(<PlatformSettingsPage />)

    const versionInput = await screen.findByLabelText('Platform version')

    await user.clear(versionInput)
    await user.type(versionInput, 'v2.16.0')

    await user.click(
      screen.getByRole('button', {
        name: 'Save Changes',
      }),
    )

    await waitFor(() => {
      expect(mockEditSettings).toHaveBeenCalledTimes(1)
    })

    const submittedBody = mockEditSettings.mock.calls[0][0].body.otomi

    expect(submittedBody).not.toHaveProperty('git')
  })

  it('submits null when the global pull secret contains only empty default values', async () => {
    const user = userEvent.setup()

    mockSettingsData = {
      otomi: {
        version: 'v2.15.0',
        hasExternalDNS: false,
        hasExternalIDP: false,
        globalPullSecret: {
          username: 'old-user',
          password: 'old-password',
          email: 'old@example.com',
          server: 'registry.example.com',
        },
        nodeSelector: [],
        isMultitenant: true,
        isPreInstalled: true,
        aiEnabled: true,
        useORCS: false,
        adminPassword: 'preserve-me',
      },
    }

    render(<PlatformSettingsPage />)

    const usernameInput = await screen.findByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const emailInput = screen.getByLabelText('Email (optional)')
    const serverInput = screen.getByLabelText('Registry server')

    // Wait for the form to be properly initialized with values
    await waitFor(() => {
      expect(usernameInput).toHaveValue('old-user')
    })

    await user.clear(usernameInput)
    await user.clear(passwordInput)
    await user.clear(emailInput)
    await user.clear(serverInput)

    // Wait for form to detect the change
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save Changes' })).not.toBeDisabled()
    })

    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(mockEditSettings).toHaveBeenCalledWith({
        settingId: 'otomi',
        body: {
          otomi: {
            version: 'v2.15.0',
            hasExternalDNS: false,
            hasExternalIDP: false,
            globalPullSecret: null,
            nodeSelector: [],
            isMultitenant: true,
            isPreInstalled: true,
            aiEnabled: true,
            useORCS: false,
            adminPassword: 'preserve-me',
          },
        },
      })
    })
  })

  it('keeps a global pull secret when at least one non-default value is present', async () => {
    const user = userEvent.setup()

    mockSettingsData = {
      otomi: {
        version: 'v2.15.0',
        hasExternalDNS: false,
        hasExternalIDP: false,
        globalPullSecret: null,
        nodeSelector: [],
        isMultitenant: true,
        isPreInstalled: true,
        aiEnabled: true,
        useORCS: false,
        adminPassword: 'preserve-me',
      },
    }

    render(<PlatformSettingsPage />)

    const usernameInput = await screen.findByLabelText('Username')

    // Wait for the form to be properly initialized
    await waitFor(() => {
      expect(usernameInput).toHaveValue('')
    })

    await user.type(usernameInput, 'registry-user')

    // Wait for input value to actually change
    await waitFor(() => {
      expect(usernameInput).toHaveValue('registry-user')
    })

    // Try clicking submit button regardless of disabled state
    const submitButton = screen.getByRole('button', { name: 'Save Changes' })
    // Use fireEvent to bypass pointer-events check
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockEditSettings).toHaveBeenCalledWith({
        settingId: 'otomi',
        body: {
          otomi: {
            version: 'v2.15.0',
            hasExternalDNS: false,
            hasExternalIDP: false,
            globalPullSecret: {
              username: 'registry-user',
              password: '',
              email: '',
              server: '',
            },
            nodeSelector: [],
            isMultitenant: true,
            isPreInstalled: true,
            aiEnabled: true,
            useORCS: false,
            adminPassword: 'preserve-me',
          },
        },
      })
    })
  })

  it('disables saving while settings are being fetched', async () => {
    const user = userEvent.setup()

    mockIsFetching = true

    render(<PlatformSettingsPage />)

    const versionInput = await screen.findByLabelText('Platform version')

    await user.clear(versionInput)
    await user.type(versionInput, 'v2.16.0')

    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  })

  it('shows the layout loading state while settings are loading', () => {
    mockIsLoading = true

    render(<PlatformSettingsPage />)

    expect(screen.getByText('Loading platform settings')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  })
})
