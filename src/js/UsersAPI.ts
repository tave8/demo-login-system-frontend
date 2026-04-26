// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import { RequestMethod, RequireLogin, UpdatedUserToAPI, UserFromAPI } from "./my_types"


export default class UsersAPI extends BaseAPI {
  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * Get the info/profile of the currently
   * logged in user.
   */
  public async getMyInfo(): Promise<UserFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/users/me", config)

    const data = await APIHelper.parseJSON<UserFromAPI>(resp)

    return data
  }

  /**
   * Update the info/profile of the currently
   * logged in user.
   */
  public async updateMyInfo(updatedUser: UpdatedUserToAPI): Promise<UserFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.PUT, RequireLogin.YES, updatedUser)

    const resp: Response = await APIHelper.doFetchAt("/users/me", config)

    const data = await APIHelper.parseJSON<UserFromAPI>(resp)

    return data
  }
}
