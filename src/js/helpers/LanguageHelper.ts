import {Language} from "../my_types.ts";

/**
 * Helper class for getting info about the user's language.
 */
export default class LanguageHelper {

    // frontend's default language
    private static DEFAULT_LANGUAGE: Language = Language.IT

    public static getLanguage(): Language {
        return this.DEFAULT_LANGUAGE
    }

}