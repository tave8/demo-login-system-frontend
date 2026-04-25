import { isLoggedIn } from "../auth/isLoggedIn"

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
}
