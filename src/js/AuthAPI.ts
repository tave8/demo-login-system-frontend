// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { RequestMethod, RequireLogin, SignupToAPI, SignupFromAPI, LoginToAPI, LoginFromAPI } from "./my_types"

export default class AuthAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Logins a user.
   */
  public async login(loginData: LoginToAPI): Promise<LoginFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, loginData)

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

    const data = await APIHelper.parseJSON<LoginFromAPI>(resp)

    return data
  }

  /**
   * Signs up a user.
   */
  public async signup(signupData: SignupToAPI): Promise<SignupFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, signupData)

    const resp: Response = await APIHelper.doFetchAt(`/auth/register`, config)

    const data = await APIHelper.parseJSON<SignupFromAPI>(resp)

    return data
  }
}
