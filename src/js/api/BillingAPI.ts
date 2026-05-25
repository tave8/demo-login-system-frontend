
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
  ForgotPasswordNewPasswordFromAPI, ForgotPasswordVerifyCodeToAPI, ForgotPasswordVerifyCodeFromAPI, OperatorLoginToAPI,
  ResetPasswordToAPI, UserFromAPI, TasksPageFromAPI, BillingPortalFromAPI
} from "../my_types"

export default class BillingAPI extends BaseAPI {

  private static instance: BillingAPI

  constructor() {
    // call new BaseAPI()
    super()
  }

  public static getInstance(): BillingAPI {
    if(this.instance == null) {
      this.instance = new BillingAPI()
    }
    return this.instance
  }


  /**
   * Get Customer Billing Portal.
   */
  public async getBillingPortal(): Promise<BillingPortalFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const endpoint = `/billing/portal`

    const resp: Response = await this.doFetchAt(endpoint, config)

    const data = await this.parseJSON<BillingPortalFromAPI>(resp)

    return data
  }


}
