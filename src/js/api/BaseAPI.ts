import APIHelper from "./APIHelper.ts";
import NetworkError from "../exceptions/NetworkError.ts";
import ExpectedJSONPayloadError from "../exceptions/ExpectedJSONPayloadError.ts";
import ShouldLogoutError from "../exceptions/ShouldLogoutError.ts";

export default abstract class BaseAPI {

    /**
     * Use this when you want automatic, app-specific
     * error management, without having to handle
     * all error cases manually.
     * For example, if a network error occurs,
     * you want to show a toast message, without having
     * to repeat this logic in every API call.
     *
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
            console.error(err)

            // app-specific actions to be triggered when
            // an error is thrown
            if(err instanceof NetworkError) {
                // console.log("NETWORK ERROR!")
                const errMsg = "There was a network error. Please check your connection."
                window.dispatchEvent(new CustomEvent("app-error", { detail: errMsg }));
            }

        })

    }


    /**
     *
     *
     * @param resp
     */
    public async parseJSON<T_FROM_API>(resp: Response): Promise<T_FROM_API>
    {

        return await APIHelper.parseJSONButIfError(resp, (err: Error)=> {
            console.error(err)

            if(err instanceof ExpectedJSONPayloadError) {
                window.dispatchEvent(new CustomEvent("app-error", {
                    detail: "Internal error (expected JSON payload)"
                }));

            } else if (err instanceof ShouldLogoutError) {

            }

        })

    }

}
