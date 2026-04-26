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
  constructor(statusCode: number, details?: string) {
    const baseMessage = `Server response is not ok. Status code was '${statusCode}'.`
    const fullMessage = details ? `${baseMessage} DETAILS: ${details}` : baseMessage

    super(fullMessage)
  }
}
