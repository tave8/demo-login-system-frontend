import HttpError from "./HttpError.ts";

export default class ShouldLogoutError extends HttpError  {
    constructor(statusCode: number, details?: string) {
        super(statusCode, details)
    }
}
