import BaseAPI from "./BaseAPI.ts";
import {ClientFromAPI, ClientToAPI, RequestMethod, RequireLogin} from "../my_types.ts";
import APIHelper from "./APIHelper.ts";

export default class QrCodeAPI extends BaseAPI {

    private static instance: QrCodeAPI

    constructor() {
        // call new BaseAPI()
        super()
    }

    /**
     * (Uses singleton design pattern)
     */
    public static getInstance(): QrCodeAPI {
        if (this.instance == null) {
            this.instance = new QrCodeAPI()
        }
        return this.instance
    }


    /**
     * Verify a QR code.
     */
    public async verify(token: string): Promise<{ message: string }> {
        const config = APIHelper.getFetchConfigFor(RequestMethod.POST, RequireLogin.YES, {})

        const endpoint = `/qrcode/${token}/verify`

        const resp: Response = await this.doFetchAt(endpoint, config)

        const data = await this.parseJSON<{ message: string }>(resp)

        return data
    }

}