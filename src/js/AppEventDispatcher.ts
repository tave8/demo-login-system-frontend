import {AppEvent, AppEventMessage, AppEventMessageType, Language} from "./my_types.ts";
import LanguageHelper from "./helpers/LanguageHelper.ts";

/**
 * App Event Dispatcher.
 *
 * Uses Singleton pattern.
 */
export default class AppEventDispatcher {

    private static instance: AppEventDispatcher

    constructor() {

    }

    /**
     * Dispatch an event.
     *
     * @param eventName
     * @param msg
     */
    public dispatch(eventName: AppEvent, msg: string): void
    {

        // here you can do any checks

        const customEvent = new CustomEvent(eventName, {
            detail: msg
        })

        // dispatch a custom event
        window.dispatchEvent(customEvent)

    }

    /**
     * Dispatch a standard app event using
     * current app's language.
     */
    public dispatchStandard(eventName: AppEvent,
                            eventType: AppEventMessageType,
                            details: string = ""): void
    {

        const lang = LanguageHelper.getLanguage()

        this.dispatch(
            eventName,
            AppEventMessage[lang][eventType] + details
        )

    }


    public static getInstance(): AppEventDispatcher {

        // if there's on instance, create it
        if(this.instance == null) {
            this.instance = new AppEventDispatcher()
        }

        // return the instance, whether it was
        // just created or it was already there
        return this.instance

    }


}