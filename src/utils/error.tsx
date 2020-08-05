/* eslint-disable max-classes-per-file */
import React from 'react'
import Err from '../components/Error'

export class ApiError extends Error {
  code?: number

  constructor(message: any, code?: number | undefined) {
    super(message)
    this.code = code
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ApiErrorUnauthorized extends ApiError {
  constructor() {
    super('Not Authorized!', 401)
  }
}
export class ApiErrorUnknown extends ApiError {
  constructor() {
    super('An unknown error occured.', 500)
  }
}

type ErrorHandler = (error: Error, info: React.ErrorInfo) => void
type ErrorHandlingComponent<Props> = (props: Props, error?: Error) => React.ReactNode

type ErrorState = { error?: Error }

function Catch<Props extends {}>(
  component: ErrorHandlingComponent<Props>,
  errorHandler?: ErrorHandler,
): React.ComponentType<Props> {
  function Inner({ props, error }: { error?: Error; props: Props }) {
    return <>{component(props, error)}</>
  }

  return class extends React.Component<Props, ErrorState> {
    // eslint-disable-next-line react/state-in-constructor
    state: ErrorState = {
      error: undefined,
    }

    static getDerivedStateFromError(error: Error) {
      return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      if (errorHandler) {
        errorHandler(error, info)
      }
    }

    render() {
      const { error } = this.state
      return <Inner error={error} props={this.props} />
    }
  }
}
type Props = {
  children: React.ReactNode
}

export default Catch(function MyErrorBoundary({ children }: Props, error?: ApiError) {
  if (error) {
    const { code, message } = error
    return <Err code={code} msg={message} />
  }
  return <>{children}</>
})
