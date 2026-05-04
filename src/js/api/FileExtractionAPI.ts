import BaseAPI from "./BaseAPI.ts";
import {RequestMethod, RequireLogin, UserFromAPI} from "../my_types.ts";
import FileHelper from "../helpers/FileHelper.ts";
import APIHelper from "./APIHelper.ts";

/**
 * File Extract API.
 * Extract text from files.
 */
export default class FileExtractionAPI extends BaseAPI {
    constructor() {
        super();
    }

    /**
     *
     */
    public async extractCV(cv: File): Promise<unknown> {
        // all checks that must be passed to upload this avatar image
        FileHelper.requireValidPdf(cv)

        const config = APIHelper.getFetchConfigForFile(RequestMethod.POST, cv, "file", RequireLogin.YES)

        const resp: Response = await this.doFetchAt("/ai/extract/cv", config)

        const data = await this.parseJSON<unknown>(resp)

        return data
    }

}