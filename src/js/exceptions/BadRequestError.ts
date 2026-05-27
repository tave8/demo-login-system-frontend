import HttpError from "./HttpError"
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class BadRequestError extends HttpError {
  constructor(body: ErrorPayloadFromAPI, details?: string) {
    super(400, body, details)
  }
}
