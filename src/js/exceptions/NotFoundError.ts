import HttpError from "./HttpError.ts";

export default class NotFoundError extends HttpError {
    constructor(details?: string) {
        super(404, details)
    }
}
