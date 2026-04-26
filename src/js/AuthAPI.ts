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
   * Login a user.
   */
  public async login(loginData: LoginToAPI): Promise<LoginFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, loginData)

    const resp: Response = await APIHelper.doFetchAt(`/auth/login`, config)

    const data = await APIHelper.parseJSON<LoginFromAPI>(resp)

    return data
  }

  /**
   * Sign up a user.
   */
  public async signup(signupData: SignupToAPI): Promise<SignupFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, signupData)

    const resp: Response = await APIHelper.doFetchAt(`/auth/register`, config)

    const data = await APIHelper.parseJSON<SignupFromAPI>(resp)

    return data
  }
}
