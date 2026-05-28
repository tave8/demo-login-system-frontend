/**
 * Helper class for whatsapp messages.
 */
export default class WhatsappHelper {

    public static MY_PHONE: string = "+393519621756"

    /**
     * Build the URL that you can use directly.
     *
     * @param phone
     * @param text
     */
    public static buildURL(phone: string = "", text: string = ""): string {
        return `https://api.whatsapp.com/send/?text=${encodeURIComponent(text)}&phone=${phone}`
    }

    public static buildURLMyPhone(text: string = ""): string {
        return this.buildURL(this.MY_PHONE, text)
    }

    /**
     * Ask me help.
     */
    public static askMeHelp(): string {
        const msg = `Ciao Giuseppe, ero su ZeroChiamate e `
        return this.buildURLMyPhone(msg)
    }


}