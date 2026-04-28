import ShouldLogoutError from "./ShouldLogoutError.ts";

export default class UnauthorizedError extends ShouldLogoutError  {
  constructor(details?: string) {
    super(401, details)
  }
}
