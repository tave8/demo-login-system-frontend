import {AppEvent} from "./my_types.ts";

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
    public dispatch(eventName: AppEvent, msg: string): void {

        // here you can do any checks

        // dispatch a custom event
        window.dispatchEvent(new CustomEvent(eventName, {
            detail: msg
        }))

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