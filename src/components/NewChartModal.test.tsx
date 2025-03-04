// NewChartModal.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import NewChartModal from './NewChartModal'

// Provide required props for NewChartModal
const defaultProps = {
  open: true,
  handleClose: jest.fn(),
  handleAction: jest.fn(),
  title: 'Add Helm Chart',
  cancelButtonText: 'Cancel',
  actionButtonText: 'Add Chart',
}

describe('NewChartModal', () => {
  test('submit button is disabled if required fields are empty', () => {
    render(<NewChartModal {...defaultProps} />)

    // Initially, the connection is not tested so the form is invalid.
    const addChartButton = screen.getByRole('button', { name: /add chart/i })
    expect(addChartButton).toBeDisabled()
  })

  test('submit button is enabled when a chart is succesfully fetched', async () => {
    render(<NewChartModal {...defaultProps} />)
    // Paste in a valid GitHub URL (ending with chart.yaml)
    const urlInput = screen.getByLabelText(/github url/i)
    userEvent.clear(urlInput)
    const clipboardData = 'https://github.com/nats-io/k8s/blob/main/helm/charts/nats/Chart.yaml'
    userEvent.paste(clipboardData)

    // Click "Get details" to simulate a successful test connection.
    const getDetailsButton = screen.getByRole('button', { name: /get details/i })
    userEvent.click(getDetailsButton)

    // Wait for the Chart Name field to become enabled (indicating connectionTested is finished).
    await waitFor(() => {
      expect(screen.getByLabelText(/chart name/i)).not.toBeDisabled()
    })

    // Expect the 'add chart' button to be enabled as all fields should be populated
    const addChartButton = screen.getByRole('button', { name: /add chart/i })
    expect(addChartButton).toBeEnabled()
  })

  test('shows error when URL is not a GitHub URL', async () => {
    render(<NewChartModal {...defaultProps} />)
    // Paste in an invalid GitHub URL (URL does not contain github)
    const urlInput = screen.getByLabelText(/github url/i)
    userEvent.clear(urlInput)
    const clipboardData = 'https://ithub.com/blob/main/helm/charts/nats/Chart.yaml'
    userEvent.paste(clipboardData)

    const errorMsg = await screen.findByText(/URL must be a valid GitHub URL/i)
    expect(errorMsg).toBeInTheDocument()
  })

  test('shows error when URL does not end with chart.yaml', async () => {
    render(<NewChartModal {...defaultProps} />)
    // Paste in an invalid GitHub URL (URL is a valid github URL but does not end with Chart.yaml)
    const urlInput = screen.getByLabelText(/github url/i)
    userEvent.clear(urlInput)
    const clipboardData = 'https://github.com/bitnami/charts/blob/main/bitnami/cassandra/Chart.txt'
    userEvent.paste(clipboardData)

    const errorMsg = await screen.findByText(/his is a valid GitHub URL but does not end with/i)
    expect(errorMsg).toBeInTheDocument()
  })
})
