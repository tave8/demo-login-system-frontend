

import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import FileHelper from "../helpers/FileHelper"
import {
    ArticleFromAPI,
    ArticlesPageFromAPI, BackgroundJobAcceptedFromAPI, ClientAddressesPageFromAPI,
    ClientAddressFromAPI,
    ClientAddressQueryParamsToAPI, ClientAddressToAPI, ClientFromAPI, ClientQueryParamsToAPI, ClientsPageFromAPI,
    ClientToAPI,
    ContractExpectationFromAPI, EnrichedArticleFromAPI, EnrichedArticlesPageFromAPI, EnrichedClientAddressesPageFromAPI,
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
     * Get client addresses.
     */
    public async getClientAddresses(): Promise<ClientAddressesPageFromAPI> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAt("/clients/addresses", config)

        const data = await this.parseJSON<ClientAddressesPageFromAPI>(resp)

        return data
    }

    /**
     * Search client addresses.
     */
    public async searchClientAddresses(query: string): Promise<ClientAddressesPageFromAPI> {

        const params: ClientAddressQueryParamsToAPI = {
            q: query
        }

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAtWithParams(
            "/clients/addresses",
            config,
            params as unknown as Record<string, string>
        )

        const data = await this.parseJSON<ClientAddressesPageFromAPI>(resp)

        return data
    }


    /**
     * Find contract expectation of client address.
     */
    public async findContractExpectation(clientAddressId: string): Promise<ContractExpectationFromAPI>
    {

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const endpoint = `/client-addresses/${clientAddressId}/contract-expectations`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<ContractExpectationFromAPI>(resp)

        return data

    }

    /**
     * Upload contract to be processed, to extract expectations.
     */
    public async uploadContractForExtraction(clientAddressId: string,
                                             contract: File): Promise<BackgroundJobAcceptedFromAPI>
    {
        // all checks that must be passed to upload this avatar image
        FileHelper.requireValidPdf(contract)

        const endpoint = `/client-addresses/${clientAddressId}/contract-expectations`

        const config = APIHelper.getFetchConfigForFile(RequestMethod.POST, contract, "file", RequireLogin.YES)

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<BackgroundJobAcceptedFromAPI>(resp)

        return data
    }

    // public async updateContractExpectations

}
