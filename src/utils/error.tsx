/* eslint-disable max-classes-per-file */
import { e } from 'i18n/i18n'

export class HttpError extends Error {
  code?: number

  constructor(message: string, code?: number | undefined) {
    super(message)
    this.code = code
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }

  public static fromCode(code: number): HttpError {
    return new HttpError(e[code], code)
  }
}

export class HttpErrorBadRequest extends HttpError {
  constructor() {
    super(e['The route does not exist'], 400)
  }
}

export class ApiError extends HttpError {
  extendedMessage?: string | { title: string; message: string } | undefined

  constructor(
    message: string,
    code?: number | undefined,
    extendedMessage?: string | { title: string; message: string } | undefined,
  ) {
    super(message)
    this.extendedMessage = extendedMessage
    this.code = code
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
export class ApiErrorGatewayTimeout extends ApiError {
  constructor() {
    super('API error', 504, { title: 'API', message: 'The api could not be reached' })
  }
}
export class ApiErrorUnauthorized extends ApiError {
  constructor() {
    super('API error', 403, {
      title: 'No OIDC Claim',
      message: 'Unauthorized. The user may not be assigned to any team.',
    })
  }
}

export class ApiErrorUnauthorizedNoGroups extends ApiError {
  constructor() {
    super('API error', 666, {
      title: 'No OIDC Claim',
      message: 'It seems that this user does not belong to any team. Please check the groups claim of the id token.',
    })
  }
}
