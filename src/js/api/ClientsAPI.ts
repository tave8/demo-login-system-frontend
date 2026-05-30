

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ClientFromAPI, ClientQueryParamsToAPI, ClientsPageFromAPI,
    ClientToAPI,
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

export default class ClientsAPI extends BaseAPI {

    private static instance: ClientsAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): ClientsAPI {
        if(this.instance == null) {
            this.instance = new ClientsAPI()
        }
        return this.instance
    }


    /**
     * Enrich a pagination page.
     */
    private enrichPage(page: ClientsPageFromAPI): EnrichedClientsPageFromAPI {
        const enrichedItems = this.enrichItems(page.content)
        return {
            ...page,
            content: enrichedItems,
        }
    }

    private enrichItems(items: ClientFromAPI[]): EnrichedClientFromAPI[] {
        return items.map((item) => this.enrichItem(item))
    }

    /**
     * Enriches an item coming from the API.
     */
    private enrichItem(item: ClientFromAPI): EnrichedClientFromAPI {
        return {
            ...item,
            // add custom fields to each item
        }
    }


    /**
     * Add a client.
     */
    public async addClient(newClient: ClientToAPI): Promise<ClientFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, newClient)

        const resp: Response = await this.doFetchAt("/clients", config)

        const data = await this.parseJSON<ClientFromAPI>(resp)

        return data
    }

    /**
     * Get clients.
     */
    public async getClients(): Promise<ClientsPageFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAt("/clients", config)

        const data = await this.parseJSON<ClientsPageFromAPI>(resp)

        return data
    }

    public async getClientsEnriched(): Promise<EnrichedClientsPageFromAPI> {
        const page = await this.getClients()
        return this.enrichPage(page)
    }


    /**
     * Search clients by legal name.
     */
    public async searchClients(partialLegalName: string): Promise<ClientsPageFromAPI>
    {

        const params: ClientQueryParamsToAPI = {
            legalName: partialLegalName
        }

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAtWithParams(
            "/clients",
            config,
            params as unknown as Record<string, string>
        )

        const data = await this.parseJSON<ClientsPageFromAPI>(resp)

        return data
    }

    public async searchClientsEnriched(partialLegalName: string): Promise<EnrichedClientsPageFromAPI> {
        const page = await this.searchClients(partialLegalName)
        return this.enrichPage(page)
    }


}
