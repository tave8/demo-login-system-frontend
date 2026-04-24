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
