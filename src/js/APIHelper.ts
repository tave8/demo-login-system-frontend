import BaseAPI from "./BaseAPI"

const API_URL = import.meta.env.VITE_API_URL

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
}
