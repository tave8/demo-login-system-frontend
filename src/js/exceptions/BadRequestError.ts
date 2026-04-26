import HttpError from "./HttpError"

export default class BadRequestError extends HttpError {
  constructor(details?: string) {
    super(400, details)
  }
}
