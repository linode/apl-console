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

export class ApiError extends HttpError {}
export class ApiErrorGatewayTimeout extends ApiError {
  constructor() {
    super(e['The api could not be reached'], 504)
  }
}
export class ApiErrorUnauthorized extends ApiError {
  constructor() {
    super(e['Unauthorized. The user may not be assigned to any team.'], 403)
  }
}

export class ApiErrorUnauthorizedNoGroups extends ApiError {
  constructor() {
    super('It seems that a user does not belong to any team. Please check the groups claim of the id_token')
  }
}
