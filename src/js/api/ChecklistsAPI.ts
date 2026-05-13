

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, ChecklistsPageFromAPI, ChecklistWithSimpleEntriesToAPI, ClientAddressesPageFromAPI,
    ClientAddressFromAPI,
    ClientAddressQueryParamsToAPI, ClientAddressToAPI, ClientFromAPI, ClientQueryParamsToAPI, ClientsPageFromAPI,
    ClientToAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedClientAddressesPageFromAPI,
    EnrichedClientAddressFromAPI,
    EnrichedClientFromAPI,
    EnrichedClientsPageFromAPI, EnrichedTaskFromAPI, EnrichedTasksPageFromAPI,
    EnrichedUserFromAPI, EnrichedUsersPageFromAPI,
    NewUserFromAPI,
    NewUserToAPI,
    RequestMethod,
    RequireLogin, TaskFromAPI, TasksPageFromAPI, TaskToAPI,
    UpdatedUserToAPI,
    UserFromAPI, UsersPageFromAPI
} from "../my_types"
import TimeHelper from "../helpers/TimeHelper.ts";
import UserRoleHelper from "../helpers/UserRoleHelper.ts";

export default class ChecklistsAPI extends BaseAPI {

    private static instance: ChecklistsAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): ChecklistsAPI {
        if(this.instance == null) {
            this.instance = new ChecklistsAPI()
        }
        return this.instance
    }


    /**
     * Enrich a pagination page.
     */
    // private enrichPage(page: TasksPageFromAPI): EnrichedTasksPageFromAPI {
    //     const enrichedItems = this.enrichItems(page.content)
    //     return {
    //         ...page,
    //         content: enrichedItems,
    //     }
    // }
    //
    // private enrichItems(items: TaskFromAPI[]): EnrichedTaskFromAPI[] {
    //     return items.map((item) => this.enrichItem(item))
    // }
    //
    // /**
    //  * Enriches an item coming from the API.
    //  */
    // private enrichItem(item: TaskFromAPI): EnrichedTaskFromAPI {
    //     return {
    //         ...item,
    //         // add custom fields to each item
    //     }
    // }


    /**
     * Add a checklist.
     */
    public async addChecklist(checklistData: ChecklistWithSimpleEntriesToAPI): Promise<void>
    {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, checklistData)

        const endpoint = `/checklists`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<void>(resp)

        return data
    }

    /**
     * Get checklists.
     */
    public async getChecklists(): Promise<ChecklistsPageFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const endpoint = `/checklists`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<ChecklistsPageFromAPI>(resp)

        return data
    }


    /**
     * Search checklists.
     */
    public async searchChecklists(query: string): Promise<ChecklistsPageFromAPI> {

        const params = {
            q: query
        }

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAtWithParams(
            "/checklists",
            config,
            params as unknown as Record<string, string>
        )

        const data = await this.parseJSON<ChecklistsPageFromAPI>(resp)

        return data
    }


}
