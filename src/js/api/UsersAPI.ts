// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import { RequestMethod, RequireLogin, UpdatedUserToAPI, UserFromAPI } from "../my_types"

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

    // const resp: Response = await APIHelper.doFetchAt("/users/me", config)
    const resp: Response = await this.doFetchAt("/users/me", config)

    const data = await this.parseJSON<UserFromAPI>(resp)

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

  /**
   * Upload my avatar image of the currently
   * logged in user.
   * 
   * @throws {InvalidFileUploadedError} if the file is not valid (empty, not an image, too big)
   */
  public async uploadMyAvatarImage(avatarImage: File): Promise<UserFromAPI> {
    // all checks that must be passed to upload this avatar image
    FileHelper.requireValidAvatarImage(avatarImage)

    const config = APIHelper.getFetchConfigForFile(RequestMethod.POST, avatarImage, "avatar_image", RequireLogin.YES)

    const resp: Response = await APIHelper.doFetchAt("/users/me/avatar-image", config)

    const data = await APIHelper.parseJSON<UserFromAPI>(resp)

    return data
  }
}
