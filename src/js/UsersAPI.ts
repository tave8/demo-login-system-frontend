// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { FetchConfigType, RequestMethod, RequireLogin } from "./my_types"

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

    // server url
    const url = APIHelper.getAPIUrlAt("/users/me")

    // const resp: Response = await APIHelper.doRequestAt()

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
