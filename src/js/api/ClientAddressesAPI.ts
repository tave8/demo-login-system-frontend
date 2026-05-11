

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, ClientAddressesPageFromAPI,
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

export default class ClientAddressesAPI extends BaseAPI {

    private static instance: ClientAddressesAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): ClientAddressesAPI {
        if(this.instance == null) {
            this.instance = new ClientAddressesAPI()
        }
        return this.instance
    }


    /**
     * Enrich a pagination page.
     */
    private enrichPage(page: ClientAddressesPageFromAPI): EnrichedClientAddressesPageFromAPI {
        const enrichedItems = this.enrichItems(page.content)
        return {
            ...page,
            content: enrichedItems,
        }
    }

    private enrichItems(items: ClientAddressFromAPI[]): EnrichedClientAddressFromAPI[] {
        return items.map((item) => this.enrichItem(item))
    }

    /**
     * Enriches an item coming from the API.
     */
    private enrichItem(item: ClientAddressFromAPI): EnrichedClientAddressFromAPI {
        return {
            ...item,
            // add custom fields to each item
        }
    }


    /**
     * Add a client-address association.
     */
    public async addAddressToClient(clientId: string, addressData: ClientAddressToAPI): Promise<ClientAddressFromAPI>
    {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, addressData)

        const endpoint = `/clients/${clientId}/addresses`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<ClientAddressFromAPI>(resp)

        return data
    }

    /**
     * Get clients.
     */
    // public async getClients(): Promise<ClientsPageFromAPI> {
    //     const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)
    //
    //     const resp: Response = await this.doFetchAt("/clients", config)
    //
    //     const data = await this.parseJSON<ClientsPageFromAPI>(resp)
    //
    //     return data
    // }
    //
    // public async getClientsEnriched(): Promise<EnrichedClientsPageFromAPI> {
    //     const page = await this.getClients()
    //     return this.enrichPage(page)
    // }
    //
    //
    // /**
    //  * Search clients by legal name.
    //  */
    // public async searchClients(partialLegalName: string): Promise<ClientsPageFromAPI>
    // {
    //
    //     const params: ClientQueryParamsToAPI = {
    //         legalName: partialLegalName
    //     }
    //
    //     const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)
    //
    //     const resp: Response = await this.doFetchAtWithParams(
    //         "/clients",
    //         config,
    //         params as unknown as Record<string, string>
    //     )
    //
    //     const data = await this.parseJSON<ClientsPageFromAPI>(resp)
    //
    //     return data
    // }
    //
    // public async searchClientsEnriched(partialLegalName: string): Promise<EnrichedClientsPageFromAPI> {
    //     const page = await this.searchClients(partialLegalName)
    //     return this.enrichPage(page)
    // }


}
