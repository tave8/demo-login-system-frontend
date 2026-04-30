import HttpError from "./HttpError"
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class BadRequestError extends HttpError {
  constructor(details?: string, body: ErrorPayloadFromAPI | null = null) {
    super(400, details, body)
  }
}
