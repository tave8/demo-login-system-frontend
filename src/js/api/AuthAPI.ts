// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import {
  RequestMethod,
  RequireLogin,
  SignupToAPI,
  SignupFromAPI,
  LoginToAPI,
  LoginFromAPI,
  ForgotPasswordRequestToAPI, ForgotPasswordRequestFromAPI, ForgotPasswordNewPasswordToAPI,
  ForgotPasswordNewPasswordFromAPI, ForgotPasswordVerifyCodeToAPI, ForgotPasswordVerifyCodeFromAPI
} from "../my_types"

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

  /**
   * Send a forgot password request, if user can set a new password.
   */
  public async sendForgotPasswordRequest(emailData: ForgotPasswordRequestToAPI): Promise<ForgotPasswordRequestFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, emailData)

    const resp: Response = await APIHelper.doFetchAt(`/auth/forgot-password/request`, config)

    const data = await APIHelper.parseJSON<ForgotPasswordRequestFromAPI>(resp)

    return data
  }

  /**
   * Is this code authorized to access the page to set a new password?
   */
  public async verifyForgotPasswordCode(authCode: ForgotPasswordVerifyCodeToAPI): Promise<ForgotPasswordVerifyCodeFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, authCode)

    const resp: Response = await APIHelper.doFetchAt(`/auth/forgot-password/verify`, config)

    const data = await APIHelper.parseJSON<ForgotPasswordVerifyCodeFromAPI>(resp)

    return data
  }


  /**
   * Set a new password for the user associated with the given code.
   * (if this code is still valid, of course)
   */
  public async setNewPasswordIfAuthorized(newPassword: ForgotPasswordNewPasswordToAPI): Promise<ForgotPasswordNewPasswordFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.NO, newPassword)

    const resp: Response = await APIHelper.doFetchAt(`/auth/forgot-password/reset`, config)

    const data = await APIHelper.parseJSON<ForgotPasswordNewPasswordFromAPI>(resp)

    return data
  }

}
