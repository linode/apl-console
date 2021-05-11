/* eslint-disable max-classes-per-file */
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
    super('Unauthorized', 401)
  }
}
