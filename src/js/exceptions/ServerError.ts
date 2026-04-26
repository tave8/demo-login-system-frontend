import HttpError from "./HttpError"

export default class ServerError extends HttpError {
  constructor(details?: string) {
    super(500, details)
  }
}
