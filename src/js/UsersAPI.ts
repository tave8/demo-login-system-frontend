// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { RequestMethod, RequireLogin } from "./my_types"

export default class UsersAPI<T_TO_API extends object | unknown, T_FROM_API extends object> extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Get the info/profile of the currently
   * logged in user.
   */
  public async getMyInfo(): Promise<T_FROM_API> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/users/me", config)

    const data = await APIHelper.parseJSON<T_FROM_API>(resp)

    return data
  }
}
