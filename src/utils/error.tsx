/* eslint-disable max-classes-per-file */
import { Keys as k } from 'translations/keys'

export class HttpError extends Error {
  code?: number

  constructor(message: any, code?: number | undefined) {
    super(message)
    this.code = code
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }

  public static fromCode(code: number): HttpError {
    return new HttpError(k[code], code)
  }
}

export class HttpErrorBadRequest extends HttpError {
  constructor() {
    super(k['The route does not exist'], 400)
  }
}

export class ApiError extends HttpError {}
export class ApiErrorGatewayTimeout extends ApiError {
  constructor() {
    super(k['The api could not be reached'], 504)
  }
}
export class ApiErrorUnauthorized extends ApiError {
  constructor() {
    super(k['Unauthorized. The user may not be assigned to any team.'], 403)
  }
}
