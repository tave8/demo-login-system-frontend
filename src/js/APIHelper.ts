import { isLoggedIn } from "../auth/isLoggedIn"
import { FetchConfigType, FetchHeaderContentType, FetchMethod } from "./my_types"

let API_URL: string

try {
  API_URL = import.meta.env.VITE_API_URL
} catch (err) {
  throw new Error("error loading env var 'VITE_API_URL'; are you sure it exists?")
}

/**
 * API helper.
 */
export default class APIHelper {
  /**
   *
   * @returns the URL of the API server
   */
  static getAPIUrl(): string {
    return API_URL
  }

  /**
   * Get the API url plus whatever endpoint.
   * Example of return value:
   * https://api.giuseppetavella.com/my/custom/endpoint
   */
  public static getAPIUrlAt(endpoint: string = ""): string {
    const trimmed = endpoint.trim()

    // if root endpoint
    if (trimmed === "") {
      return APIHelper.getAPIUrl()
    }

    // if endpoint does not start with /
    if (!trimmed.startsWith("/")) {
      throw new Error(`Endpoint must start with '/'. Got: '${endpoint}'`)
    }

    // the second character must not be another slash,
    // only if the endpoint length is > 0 (so at least 2 chars)
    if (trimmed.length > 0 && trimmed) {
      if (trimmed.charAt(1) == "/") {
        throw new Error(
          "Invalid endpoint. If it starts with one slash, " + "it cannot start with more than one slash. " + "Input endpoint was: '" + trimmed + "'",
        )
      }
    }

    // Let the URL parser decide if it's valid
    try {
      new URL(trimmed, APIHelper.getAPIUrl())
    } catch {
      throw new Error(`Malformed endpoint: '${endpoint}'`)
    }

    return APIHelper.getAPIUrl() + trimmed
  }

  /**
   *
   * @returns value of the Authorization header,
   *  thus a string prefixed with "Bearer " + access token
   */
  public static getAuthorizationHeaderValue(): string {
    return "Bearer " + APIHelper.getAccessToken()
  }

  /**
   * Get local access token,
   * which is supposed to contain
   * the necessary info used by the server
   * to authenticate the user, so at the very at least,
   * the user ID.
   */
  public static getAccessToken(): string {
    const accessToken: string | null = localStorage.getItem("token")
    // access token missing
    if (!accessToken) {
      throw new Error(
        "while getting access token from local storage, " + "access token was supposed to be there, but it's not." + "got value " + accessToken + " instead.",
      )
    }
    // if the user is not logged in, or for some reason,
    // the access token could be malformed or have been tampered with
    // at the frontend side, or it's expired
    if (!isLoggedIn()) {
      throw new Error(
        "while getting access token from local storage, the user" +
          "does not seem to be logged in. this may be due to the access token " +
          "being expired or having been tampered with. the user can try to log back in again" +
          "and check whether that solves the problem",
      )
    }
    return accessToken
  }

  /**
   * Parse a JSON from a response.
   * Require that a response body is in JSON.
   * That means, it is required that the server
   * sends a valid JSON body in its response, else
   * this function will throw an error.
   */
  public static async parseJSON<T>(resp: Response): Promise<T> {
    // the url the request was made to
    const url: string = resp.url

    const contentTypeHeader: string | null = resp.headers.get("content-type")
    // if the content-type is not even there
    if (!contentTypeHeader) {
      throw new Error(
        `Before parsing JSON from a response, the Content-type header from the response was not even there, ` +
          `therefore it is not possible to determine if this response contains JSON. URL was: ${url}`,
      )
    }
    const hasSentJSON = contentTypeHeader.includes("application/json")
    // if the content-type is different from application/json,
    // this will definitely not be a valid JSON
    if (!hasSentJSON) {
      throw new Error(
        `Before parsing JSON from a response, the Content-type header from the response ` +
          `was not 'application/json', therefore it is not possible to parse the response body into JSON. ` +
          `Content-type header value is '${contentTypeHeader}' instead. URL was: ${url}`,
      )
    }

    try {
      // try to parse the response body
      const data: T = await resp.json()
      return data
    } catch (err) {
      throw new Error(
        `After parsing JSON from a response body, it was assumed ` +
          `that this would be valid JSON, however the parsing into JSON failed. URL was: ${url}. Details of error: ` +
          err,
      )
    }
  }

  /**
   * Is the API server ok?
   */
  static async APIServerIsOk(): Promise<Boolean> {
    const url = APIHelper.getAPIUrl()

    try {
      await fetch(url)
      return true
    } catch (err) {
      return false
    }
  }

  /**
   * Get a default configuration object to
   * pass directly to the fetch function,
   * based on request method (GET, POST etc.).
   * Avoids having to pass fetch config manually.
   */
  public static getFetchConfigFor(fetchMethod: FetchMethod): FetchConfigType {
    // fetch config for GET method
    if (fetchMethod == FetchMethod.GET) {
      return {
        method: FetchMethod.GET,
        headers: {
          authorization: APIHelper.getAuthorizationHeaderValue(),
        },
      }
    }

    // if (fetchMethod == FetchMethod.POST) {

    // }

    // no default fetch config for the given fetch method
    throw new Error(
      `while getting the default fetch config for input fetch method '${fetchMethod}', ` +
        `no default config was found. maybe check whether this ` +
        `fetch method should also be mapped to a default config.`,
    )
  }
}
