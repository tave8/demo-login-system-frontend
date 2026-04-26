import HttpError from "./HttpError"

export default class UnauthorizedError extends HttpError {
  constructor(details?: string) {
    super(401, details)
  }
}
