

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, ClientAddressChecklistFromAPI, ClientAddressesPageFromAPI,
    ClientAddressFromAPI, ClientAddressToAPI, ClientFromAPI, ClientQueryParamsToAPI, ClientsPageFromAPI,
    ClientToAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedClientAddressesPageFromAPI,
    EnrichedClientAddressFromAPI,
    EnrichedClientFromAPI,
    EnrichedClientsPageFromAPI,
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

export default class ClientAddressChecklistsAPI extends BaseAPI {

    private static instance: ClientAddressChecklistsAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): ClientAddressChecklistsAPI {
        if(this.instance == null) {
            this.instance = new ClientAddressChecklistsAPI()
        }
        return this.instance
    }


    /**
     * Enrich a pagination page.
     */
    // private enrichPage(page: ClientAddressesPageFromAPI): EnrichedClientAddressesPageFromAPI {
    //     const enrichedItems = this.enrichItems(page.content)
    //     return {
    //         ...page,
    //         content: enrichedItems,
    //     }
    // }
    //
    // private enrichItems(items: ClientAddressFromAPI[]): EnrichedClientAddressFromAPI[] {
    //     return items.map((item) => this.enrichItem(item))
    // }
    //
    // /**
    //  * Enriches an item coming from the API.
    //  */
    // private enrichItem(item: ClientAddressFromAPI): EnrichedClientAddressFromAPI {
    //     return {
    //         ...item,
    //         // add custom fields to each item
    //     }
    // }


    /**
     * Add a client address-checklist association.
     */
    public async addChecklistToClientAddress(checklistId: string,
                                             clientAddressId: string): Promise<ClientAddressChecklistFromAPI>
    {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, {}, true)

        const endpoint = `/client-addresses/${clientAddressId}/checklists/${checklistId}`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<ClientAddressChecklistFromAPI>(resp)

        return data
    }

    /**
     * Get client addresses.
     */
    // public async getClientAddresses(): Promise<ClientAddressesPageFromAPI> {
    //     const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)
    //
    //     const resp: Response = await this.doFetchAt("/clients/addresses", config)
    //
    //     const data = await this.parseJSON<ClientAddressesPageFromAPI>(resp)
    //
    //     return data
    // }



}
