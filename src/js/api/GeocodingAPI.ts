import APIHelper from "./APIHelper"
import BaseAPI from "./BaseAPI"
import {
    EnrichedGeocodingAutocompleteFromAPI,
    EnrichedGeocodingAutocompleteItemFromAPI,
    GeocodingAutocompleteFromAPI, GeocodingAutocompleteItemFromAPI,
    GeocodingAutocompleteQueryParamsToAPI,
    Language,
    RequestMethod,
    RequireLogin
} from "../my_types"
import LanguageHelper from "../helpers/LanguageHelper.ts";


export default class GeocodingAPI extends BaseAPI {

    private static instance: GeocodingAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): GeocodingAPI {
        if(this.instance == null) {
            this.instance = new GeocodingAPI()
        }
        return this.instance
    }


    /**
     * Enrich a page.
     */
    private enrichPage(page: GeocodingAutocompleteFromAPI): EnrichedGeocodingAutocompleteFromAPI {
        const enrichedItems = this.enrichItems(page.results)
        return {
            ...page,
            results: enrichedItems
        }
    }

    private enrichItems(items: GeocodingAutocompleteItemFromAPI[]): EnrichedGeocodingAutocompleteItemFromAPI[] {
        return items.map((item) => this.enrichItem(item))
    }

    /**
     * Enrich an item coming from the API.
     */
    private enrichItem(item: GeocodingAutocompleteItemFromAPI): EnrichedGeocodingAutocompleteItemFromAPI {
        // confidence in percentage
        const confidenceFormatted: string = Math.trunc(item.confidence * 100) + "%"
        return {
            ...item,
            confidenceFormatted: confidenceFormatted,
        }
    }



    /**
     * Get autocomplete result for this query.
     */
    public async autocomplete(query: string,
                              lang: Language = Language.EN): Promise<GeocodingAutocompleteFromAPI>
    {

        // build query params with API helper
        const params: GeocodingAutocompleteQueryParamsToAPI = {
            q: query,
            lang: lang.toString()
        }

        const config = APIHelper.getFetchConfigFor(RequestMethod.GET, RequireLogin.YES)

        const resp: Response = await this.doFetchAtWithParams(
            "/geocoding/autocomplete",
            config,
            // must convert it to a record of strings to comply
            params as unknown as Record<string, string>
        )

        const data = await this.parseJSON<GeocodingAutocompleteFromAPI>(resp)

        return data
    }


    public async autocompleteInLocalLanguage(query: string): Promise<GeocodingAutocompleteFromAPI>
    {

        const lang = LanguageHelper.getLanguage()

        return this.autocomplete(query, lang)

    }

    public async autocompleteInLocalLanguageEnriched(query: string): Promise<EnrichedGeocodingAutocompleteFromAPI>
    {

        const result = await this.autocompleteInLocalLanguage(query)

        return this.enrichPage(result)

    }




    // public async getMyUsersEnriched(): Promise<EnrichedUsersPageFromAPI> {
    //     const page = await this.getMyUsers()
    //     return this.enrichPage(page)
    // }



}
