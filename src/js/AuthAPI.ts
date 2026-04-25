// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { FetchConfigType, RequestMethod } from "./my_types"

export default class AuthAPI<T_TO_API extends object, T_FROM_API extends object> extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Logins a user.
   */
  async login(loginData: T_TO_API): Promise<T_FROM_API> {
    const config: FetchConfigType = APIHelper.getFetchConfigFor(RequestMethod.POST, false, loginData)

    // server url
    const url = APIHelper.getAPIUrlAt("/auth/login")

    let resp: Response

    try {
      resp = await fetch(url, config)
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

    const data = await APIHelper.parseJSON<T_FROM_API>(resp)

    return data
  }

  /**
   * Signs up a user.
   */
  async signup(signupData: T_TO_API): Promise<T_FROM_API> {
    const config: FetchConfigType = APIHelper.getFetchConfigFor(RequestMethod.POST, false, signupData)

    // server url
    const url = APIHelper.getAPIUrlAt("/auth/register")

    let resp: Response

    try {
      resp = await fetch(url, config)
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

    const data = await APIHelper.parseJSON<T_FROM_API>(resp)

    return data
  }
}
