/**
 * ## Base class for HTTP requests failed due to network problems
 * 
 * Use it when a generic problem occurs WHILE making a fetch.
 * 
 * Reasons for failure include: 
 * - network problems
 * - CORS
 * - etc.
 * 
 * 
 * ## Example usage:
 * 
 * ```js
 * try {
 *      await fetch(url, config)
 * } catch(err) {
 *      // you could also pass the original error message 
 *      throw new NetworkError()
 * }
 * 
 * ```
 */
export default class NetworkError extends Error {
  constructor(details?: string) {
    super(details ? `Network error. Check that `
                      +`1) server is online. `
                      +`2) client is online. `
                      +`3) server has CORS enabled. `
                      + `If none of that solves the error, this might be a generic network error. `
                      +`DETAILS: ${details}` : `Network error.`)
  }
}
