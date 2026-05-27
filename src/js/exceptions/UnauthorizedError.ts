import ShouldLogoutError from "./ShouldLogoutError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class UnauthorizedError extends ShouldLogoutError  {
  constructor(body: ErrorPayloadFromAPI, details?: string) {
    super(401, body, details)
  }
}
