import APIHelper from "./APIHelper.ts";
import NetworkError from "../exceptions/NetworkError.ts";

export default abstract class BaseAPI {

    /**
     * Do an API call at the specific endpoint,
     * with built-in error handling.
     * The error gets re-thrown.
     *
     * Because this is a
     *
     * @param relativeURLPath
     * @param config
     */
    public async doFetchAt(relativeURLPath: string,
                           config: RequestInit): Promise<Response>
    {
        return await APIHelper.doFetchAtButIfError(relativeURLPath, config, (err: Error) => {
            // app-specific actions to be triggered when
            // an error is thrown
            if(err instanceof NetworkError) {
                console.log("NETWORK ERROR!")
            }
        })

    }

}
