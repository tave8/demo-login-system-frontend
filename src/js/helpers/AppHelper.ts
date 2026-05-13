
let FRONTEND_URL: string

try {
    // @ts-ignore
    FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL
} catch (err) {
    throw new Error("error loading env var 'VITE_FRONTEND_URL'; are you sure it exists?")
}


export default class AppHelper {

    /**
     * Get the frontend URL based on environment
     */
    public static getFrontendUrl(): string
    {

        if(FRONTEND_URL == undefined) {
            throw new Error("Environment variable FRONTEND_URL "
                                +"(or however it was called internally) missing.")
        }

        return FRONTEND_URL

    }

    /**
     * Build the frontend URL of this environment
     * + the given endpoint.
     */
    public static getFrontendUrlAt(endpoint: string = ""): string {
        const trimmed = endpoint.trim()

        // if root endpoint
        if (trimmed === "") {
            return AppHelper.getFrontendUrl()
        }

        // if endpoint does not start with /
        if (!trimmed.startsWith("/")) {
            throw new Error(`Endpoint must start with '/'. Got: '${endpoint}'`)
        }

        // endpoint cannot contain consecutive backslashes
        if (trimmed.includes("//")) {
            throw new Error(`Endpoint must not contain consecutive slashes. Got: '${endpoint}'`)
        }

        // Let the URL parser decide if it's valid
        try {
            new URL(trimmed, AppHelper.getFrontendUrl())
        } catch {
            throw new Error(`Malformed endpoint: '${endpoint}'`)
        }

        return AppHelper.getFrontendUrl() + trimmed
    }

}