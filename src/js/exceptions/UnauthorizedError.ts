import ShouldLogoutError from "./ShouldLogoutError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class UnauthorizedError extends ShouldLogoutError  {
  constructor(details?: string, body: ErrorPayloadFromAPI | null = null) {
    super(401, details, body)
  }
}
