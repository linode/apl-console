import { render, screen } from '@testing-library/react'
import InformationBanner from './InformationBanner'
import '@testing-library/jest-dom'

jest.mock(
  './Iconify',
  () =>
    function MockIconify(props: any) {
      return <div data-testid='iconify' {...props} />
    },
)

describe('InformationBanner', () => {
  it('renders the message', () => {
    render(<InformationBanner message='This is information' />)

    expect(screen.getByText('This is information')).toBeTruthy()
  })

  it('defaults to info type', () => {
    render(<InformationBanner message='Default info banner' />)

    expect(screen.getByTestId('iconify')).toHaveAttribute('icon', 'material-symbols:info')
    expect(screen.getByTestId('iconify')).toHaveAttribute('color', '#c7d030d9')
    expect(screen.getByTestId('iconify')).toHaveAttribute('width', '40')
  })

  it('renders error type', () => {
    render(<InformationBanner type='error' message='Error banner' />)

    expect(screen.getByTestId('iconify')).toHaveAttribute('icon', 'material-symbols:error-rounded')
    expect(screen.getByTestId('iconify')).toHaveAttribute('color', '#d32f2f')
    expect(screen.getByTestId('iconify')).toHaveAttribute('width', '30')
  })

  it('renders children', () => {
    render(
      <InformationBanner message='With child'>
        <button type='button'>Action</button>
      </InformationBanner>,
    )

    expect(screen.getByText('Action')).toBeTruthy()
  })

  it('renders a React node message', () => {
    render(<InformationBanner message={<span>Node message</span>} />)

    expect(screen.getByText('Node message')).toBeTruthy()
  })
})
