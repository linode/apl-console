/* eslint-disable max-classes-per-file */
import { Keys as k } from 'translations/keys'

export class ErrorRoute extends Error {
  code?: number

  constructor(message: any, code?: number | undefined) {
    super(message)
    this.code = code
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ErrorApiUnreachable extends ErrorRoute {
  constructor() {
    super(k['The api could not be reached'], 404)
  }
}
export class ErrorRouteNotExists extends ErrorRoute {
  constructor() {
    super(k['The route does not exist'], 404)
  }
}
export class ErrorUnauthorized extends ErrorRoute {
  constructor() {
    super(k['Unauthorized. The user may not be assigned to any team.'], 403)
  }
}
