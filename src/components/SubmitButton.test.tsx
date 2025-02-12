// SubmitButton.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SubmitButton from './SubmitButton'

// Mock the useTranslation hook so that t(key) returns the key.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('SubmitButton', () => {
  test('renders a submit button with text "submit" when not loading', () => {
    // Render SubmitButton with loading=false
    render(<SubmitButton loading={false} />)

    // Find the button by its role and accessible name ("submit")
    const buttonElement = screen.getByRole('button', { name: /submit/i })
    expect(buttonElement).toBeInTheDocument()

    // Check that the button has type="submit"
    expect(buttonElement).toHaveAttribute('type', 'submit')

    // Ensure that there is no loading indicator (a progress element) present.
    const progressIndicator = screen.queryByRole('progressbar')
    expect(progressIndicator).not.toBeInTheDocument()
  })

  test('renders a loading indicator and disables the button when loading is true', () => {
    // Render SubmitButton with loading=true
    render(<SubmitButton loading />)

    // When loading is true, MUI's LoadingButton renders a progress indicator.
    const progressIndicator = screen.getByRole('progressbar')
    expect(progressIndicator).toBeInTheDocument()

    // The button should be disabled when loading is true.
    const buttonElement = screen.getByRole('button')
    expect(buttonElement).toBeDisabled()
  })
})
