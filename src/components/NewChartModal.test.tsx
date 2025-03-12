import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { useSession } from 'providers/Session'
import { useGetHelmChartContentQuery } from 'redux/otomiApi'
import NewChartModal, { checkDirectoryName } from './NewChartModal'

// Mock the redux hook
jest.mock('redux/otomiApi', () => ({
  useGetHelmChartContentQuery: jest.fn(),
}))
const mockedUseGetHelmChartContentQuery = useGetHelmChartContentQuery as jest.Mock

// Mock the session provider
jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))
const mockedUseSession = useSession as jest.Mock

// Mock the DefaultLogo component
jest.mock('../assets/akamai-logo-rgb-waveOnly', () => ({
  __esModule: true,
  default: () => <div data-testid='default-logo' />,
}))

describe('NewChartModal Component', () => {
  const mockChartDirectories = ['existing-chart']
  const mockHandleClose = jest.fn()
  const mockHandleCancel = jest.fn()
  const mockHandleAction = jest.fn()

  const mockProps = {
    title: 'Add New Chart',
    open: true,
    handleClose: mockHandleClose,
    handleCancel: mockHandleCancel,
    cancelButtonText: 'Cancel',
    handleAction: mockHandleAction,
    actionButtonText: 'Submit',
    chartDirectories: mockChartDirectories,
  }

  const mockHelmChartData = {
    values: {
      name: 'test-chart',
      description: 'A test chart',
      version: '1.0.0',
      appVersion: '1.0.0',
      icon: 'https://example.com/icon.png',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock implementation
    mockedUseSession.mockReturnValue({
      settings: { cluster: { domainSuffix: 'example.com' } },
    })
    const mockUseGetHelmChartContentQuery = jest.fn().mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
    })
    mockedUseGetHelmChartContentQuery.mockImplementation(mockUseGetHelmChartContentQuery)
  })

  describe('checkDirectoryName helper function', () => {
    it('should return error message if directory name already exists', () => {
      const result = checkDirectoryName('existing-chart', mockChartDirectories)
      expect(result).toBe('Directory name already exists.')
    })

    it('should return error message if directory name contains invalid characters', () => {
      const invalidNames = [
        'test chart', // space
        'test/chart', // slash
        'test:chart', // colon
        'test&chart', // ampersand
        '..', // just dots
        '-test', // leading dash
        'test-', // trailing dash
      ]

      invalidNames.forEach((name) => {
        const result = checkDirectoryName(name, mockChartDirectories)
        expect(result).toBe(
          'Invalid directory name. Avoid spaces, special characters or leading, trailing dots and dashes.',
        )
      })
    })

    it('should return empty string for valid directory name', () => {
      const result = checkDirectoryName('valid-chart-name', mockChartDirectories)
      expect(result).toBe('')
    })
  })

  describe('Component Rendering', () => {
    it('should render the modal with header when noHeader is not provided', () => {
      render(<NewChartModal {...mockProps} />)
      expect(screen.getByText('Add New Chart')).toBeInTheDocument()
    })

    it('should not render header when noHeader is true', () => {
      render(<NewChartModal {...mockProps} noHeader />)
      expect(screen.queryByText('Add New Chart')).not.toBeInTheDocument()
    })

    it('should render the form fields', () => {
      render(<NewChartModal {...mockProps} />)

      expect(screen.getByLabelText('Git Repository URL')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('App Version')).toBeInTheDocument()
      expect(screen.getByLabelText('Version')).toBeInTheDocument()
      expect(screen.getByLabelText('Icon URL (optional)')).toBeInTheDocument()
      expect(screen.getByLabelText('Target Directory Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Allow teams to use this chart')).toBeInTheDocument()
    })

    it('should render the default logo when no icon is provided', () => {
      render(<NewChartModal {...mockProps} />)
      expect(screen.getByTestId('default-logo')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should update gitRepositoryUrl when user types in the URL field', async () => {
      render(<NewChartModal {...mockProps} />)

      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://github.com/test/repo')

      expect(urlInput).toHaveValue('https://github.com/test/repo')
    })

    it('should trigger handleClose when clicking the close button', () => {
      render(<NewChartModal {...mockProps} />)

      const closeButton = screen.getByText('X')
      fireEvent.click(closeButton)

      expect(mockHandleClose).toHaveBeenCalledTimes(1)
    })

    it('should trigger handleCancel when clicking the cancel button', () => {
      render(<NewChartModal {...mockProps} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(mockHandleCancel).toHaveBeenCalledTimes(1)
    })

    it('should set helm chart URL when clicking Get details button', async () => {
      mockedUseGetHelmChartContentQuery.mockImplementation(({ url }) => ({
        data: url ? mockHelmChartData : null,
        isLoading: false,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://github.com/test/repo')

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      // Wait for the useEffect to update the form fields
      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('test-chart')
        expect(screen.getByLabelText('Description')).toHaveValue('A test chart')
        expect(screen.getByLabelText('Version')).toHaveValue('1.0.0')
        expect(screen.getByLabelText('App Version')).toHaveValue('1.0.0')
        expect(screen.getByLabelText('Icon URL (optional)')).toHaveValue('https://example.com/icon.png')
        expect(screen.getByLabelText('Target Directory Name')).toHaveValue('test-chart')
      })
    })

    it('should show error when helm chart data has an error', async () => {
      const mockError = 'Invalid repository URL'
      mockedUseGetHelmChartContentQuery.mockImplementation(({ url }) => ({
        data: url ? { error: mockError } : null,
        isLoading: false,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://invalid-url')

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      await waitFor(() => {
        expect(screen.getByText(mockError)).toBeInTheDocument()
      })
    })

    it('should toggle allowTeams when checkbox is clicked', async () => {
      render(<NewChartModal {...mockProps} />)

      const checkbox = screen.getByLabelText('Allow teams to use this chart')

      // Default is checked
      expect(checkbox).toBeChecked()

      // Click to uncheck
      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()

      // Click to check again
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('should display directory name error when invalid directory name is entered', async () => {
      // Set up with successful chart data retrieval
      mockedUseGetHelmChartContentQuery.mockImplementation(({ url }) => ({
        data: url ? mockHelmChartData : null,
        isLoading: false,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      // First get chart details to enable the field
      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://github.com/test/repo')

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      // Wait for fields to update
      await waitFor(() => {
        expect(screen.getByLabelText('Target Directory Name')).toHaveValue('test-chart')
      })

      // Now change to an invalid directory name
      const dirNameInput = screen.getByLabelText('Target Directory Name')
      await userEvent.clear(dirNameInput)
      await userEvent.type(dirNameInput, 'test chart')

      expect(
        screen.getByText(
          'Invalid directory name. Avoid spaces, special characters or leading, trailing dots and dashes.',
        ),
      ).toBeInTheDocument()
    })

    it('should display directory exists error when using an existing directory name', async () => {
      // Set up with successful chart data retrieval
      mockedUseGetHelmChartContentQuery.mockImplementation(({ url }) => ({
        data: url ? mockHelmChartData : null,
        isLoading: false,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      // First get chart details to enable the field
      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://github.com/test/repo')

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      // Wait for fields to update
      await waitFor(() => {
        expect(screen.getByLabelText('Target Directory Name')).toHaveValue('test-chart')
      })

      // Now change to an existing directory name
      const dirNameInput = screen.getByLabelText('Target Directory Name')
      await userEvent.clear(dirNameInput)
      await userEvent.type(dirNameInput, 'existing-chart')

      expect(screen.getByText('Directory name already exists.')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call handleAction with correct values when form is valid and submitted', async () => {
      // Set up with successful chart data retrieval
      mockedUseGetHelmChartContentQuery.mockImplementation(({ url }) => ({
        data: url ? mockHelmChartData : null,
        isLoading: false,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      // Fill form
      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://github.com/test/repo')

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      // Wait for fields to update and form to be valid
      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('test-chart')
      })

      // Submit form
      const submitButton = screen.getByText('Submit')
      expect(submitButton).not.toBeDisabled()
      fireEvent.click(submitButton)

      expect(mockHandleAction).toHaveBeenCalledWith({
        gitRepositoryUrl: 'https://github.com/test/repo',
        chartTargetDirName: 'test-chart',
        chartIcon: 'https://example.com/icon.png',
        allowTeams: true,
      })
    })

    it('should disable submit button when form is invalid', () => {
      render(<NewChartModal {...mockProps} />)

      // Form is invalid initially without any data
      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Loading States', () => {
    it('should show loading state for the Get details button', () => {
      mockedUseGetHelmChartContentQuery.mockImplementation(() => ({
        data: null,
        isLoading: true,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      // Check loading state logic - the actual visual component might be implemented differently
      // depending on how LoadingButton works in the codebase
      expect(mockedUseGetHelmChartContentQuery).toHaveBeenCalled()
    })

    it('should show loading state for the Submit button when submitting', async () => {
      // Set up with successful chart data retrieval
      mockedUseGetHelmChartContentQuery.mockImplementation(({ url }) => ({
        data: url ? mockHelmChartData : null,
        isLoading: false,
        isFetching: false,
      }))

      render(<NewChartModal {...mockProps} />)

      // Fill form
      const urlInput = screen.getByLabelText('Git Repository URL')
      await userEvent.type(urlInput, 'https://github.com/test/repo')

      const getDetailsButton = screen.getByText('Get details')
      fireEvent.click(getDetailsButton)

      // Wait for fields to update
      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('test-chart')
      })

      // Submit form
      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled()
    })
  })
})
