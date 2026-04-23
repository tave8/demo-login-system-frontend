// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { SignupFromAPI, SignupForAPI } from "./my_types"

console.log(APIHelper.getAPIUrl())

export default class AuthAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
    // console.log(this.API_URL)
  }

  /**
   * Signs up a user.
   */
  async signup(signupData: SignupForAPI) {
    const defaultConfig = {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(signupData),
    }
    const moreConfig = {}
    const finalConfig = { ...defaultConfig, ...moreConfig }

    // server url
    const url = APIHelper.getAPIUrl() + "/auth/register"

    let resp: Response

    try {
      resp = await fetch(url, finalConfig)
    } catch (err) {
      throw new Error(`Error DURING fetch. Details: ${err}`)
    }

    try {
      if (!resp.ok) {
        throw new Error(`Error AFTER fetch. Response status code: ${resp.status}`)
      }
    } catch (err) {
      throw err
    }

    const data: SignupFromAPI = await resp.json()

    return data
  }
}
