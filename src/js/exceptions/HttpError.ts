import {ErrorPayloadFromAPI} from "../my_types.ts";

/**
 * ## Base class for HTTP responses whose status code is not ok
 * 
 * Use it when a non-ok status code
 * has not been been handled previously.
 * 
 * 
 * ## Example usage (after making sure that are no network problems):
 * 
 * ```js
 * 
 * if (!resp.ok) {
 *     // can optionally pass a details message
 *     throw new HttpError(resp.status)
 *  }
 * 
 * ```
 */
export default class HttpError extends Error {

  public body: ErrorPayloadFromAPI | null = null

  constructor(statusCode: number, details?: string, body: ErrorPayloadFromAPI | null = null) {
    const baseMessage = `Server response is not ok. Status code was '${statusCode}'.`
    const fullMessage = details ? `${baseMessage} DETAILS: ${details}` : baseMessage
    super(fullMessage)
    this.body = body
  }

  /**
   * If there are errors in the body, simply
   * join them to make a string.
   */
  public getErrorsAsStr(): string {
    if (this.body != null) {
      try {
        return Object.values(this.body.errors).flat().join(", ");
      } catch (err) {
        return "<error parsing the body>"
      }
    }
    return `<no errors found in body>`;
  }

}
