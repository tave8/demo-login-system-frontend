// sign up

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
  ArticleFromAPI,
  ArticlesPageFromAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI,
  EnrichedUserFromAPI, EnrichedUsersPageFromAPI,
  NewUserFromAPI,
  NewUserToAPI,
  RequestMethod,
  RequireLogin,
  UpdatedUserToAPI,
  UserFromAPI, UsersPageFromAPI
} from "../my_types"
import TimeHelper from "../helpers/TimeHelper.ts";
import UserRoleHelper from "../helpers/UserRoleHelper.ts";

export default class UsersAPI extends BaseAPI {

  private static instance: UsersAPI

  constructor() {
    // call new BaseAPI()
    super()
  }

  /**
   * (Uses singleton design pattern)
   */
  public static getInstance(): UsersAPI {
    if(this.instance == null) {
      this.instance = new UsersAPI()
    }
    return this.instance
  }


  /**
   * Enrich a pagination page.
   */
  private enrichPage(page: UsersPageFromAPI): EnrichedUsersPageFromAPI {
    const enrichedItems = this.enrichItems(page.content)
    return {
      ...page,
      content: enrichedItems,
    }
  }

  private enrichItems(items: UserFromAPI[]): EnrichedUserFromAPI[] {
    return items.map((item) => this.enrichItem(item))
  }

  /**
   * Enriches an item coming from the API.
   */
  private enrichItem(item: UserFromAPI): EnrichedUserFromAPI {
    return {
      ...item,
      // for now i'll keep it as is
      roleInLocalLanguage: UserRoleHelper.getRole(item.role),
    }
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

    const resp: Response = await this.doFetchAt("/users/me", config)

    const data = await this.parseJSON<UserFromAPI>(resp)

    return data
  }


  /**
   * Add a user.
   * Only the admin should be allowed to add users.
   */
  public async addUser(newUser: NewUserToAPI): Promise<NewUserFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, newUser)

    const resp: Response = await this.doFetchAt("/users", config)

    const data = await this.parseJSON<NewUserFromAPI>(resp)

    return data
  }

  /**
   * Get my users (aka my team).
   * TODO: replace unknown with actual types (you might need to create the pagination etc.)
   */
  public async getMyUsers(): Promise<UsersPageFromAPI> {
    const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

    const resp: Response = await this.doFetchAt("/users", config)

    const data = await this.parseJSON<UsersPageFromAPI>(resp)

    return data
  }

  public async getMyUsersEnriched(): Promise<EnrichedUsersPageFromAPI> {
    const page = await this.getMyUsers()
    return this.enrichPage(page)
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

    const resp: Response = await this.doFetchAt("/users/me/avatar-image", config)

    const data = await this.parseJSON<UserFromAPI>(resp)

    return data
  }
}
