/* eslint-disable max-classes-per-file */
import { e } from 'i18n/i18n'

class HttpError extends Error {
  constructor(message: string, public code?: number, public title?: string) {
    // Ensure to add the corresponding message translation in public/i18n/*/error.json and src/i18n/trans/error.json
    super(message)
    this.name = this.constructor.name
  }

  static fromCode(code: number): HttpError {
    return new HttpError(e[code], code)
  }
}

class HttpErrorBadRequest extends HttpError {
  constructor() {
    super(e['The route does not exist.'], 400)
  }
}

class HttpErrorForbidden extends HttpError {
  constructor() {
    super(
      e['You are not allowed to access this page. Perhaps you’ve mistyped the URL? Be sure to check your spelling.'],
      403,
    )
  }
}

class ApiErrorServiceUnavailable extends HttpError {
  constructor() {
    super(e['The API could not be reached.'], 503)
  }
}
class ApiErrorGatewayTimeout extends HttpError {
  constructor() {
    super(e['The API could not be reached.'], 504)
  }
}

class ApiErrorUnauthorized extends HttpError {
  constructor() {
    super(e['Unauthorized! The user may not be assigned to any team.'], 403, 'No OIDC Claim')
  }
}

class ApiErrorUnauthorizedNoGroups extends HttpError {
  constructor() {
    super(
      e[
        'It seems that this user does not belong to any team. Please check the groups claim of the ID token or contact your administrator.'
      ],
      403,
      'No OIDC Claim',
    )
  }
}

export {
  HttpError,
  HttpErrorBadRequest,
  HttpErrorForbidden,
  ApiErrorServiceUnavailable,
  ApiErrorGatewayTimeout,
  ApiErrorUnauthorized,
  ApiErrorUnauthorizedNoGroups,
}
