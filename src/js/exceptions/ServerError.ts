import HttpError from "./HttpError"
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class ServerError extends HttpError {
  constructor(body: ErrorPayloadFromAPI, details?: string) {
    super(500, body, details)
  }
}
