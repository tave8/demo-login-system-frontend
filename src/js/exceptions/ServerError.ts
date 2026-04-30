import HttpError from "./HttpError"
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class ServerError extends HttpError {
  constructor(details?: string, body: ErrorPayloadFromAPI | null = null) {
    super(500, details, body)
  }
}
