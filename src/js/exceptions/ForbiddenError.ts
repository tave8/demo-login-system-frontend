import ShouldLogoutError from "./ShouldLogoutError.ts";
import {ErrorPayloadFromAPI} from "../my_types.ts";

export default class ForbiddenError extends ShouldLogoutError {
    constructor(details?: string, body: ErrorPayloadFromAPI | null = null) {
        super(403, details, body)
    }
}
