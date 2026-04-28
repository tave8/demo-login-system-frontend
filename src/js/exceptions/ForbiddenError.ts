import ShouldLogoutError from "./ShouldLogoutError.ts";

export default class ForbiddenError extends ShouldLogoutError {
    constructor(details?: string) {
        super(403, details)
    }
}
