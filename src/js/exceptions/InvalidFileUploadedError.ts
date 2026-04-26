
/**
 * ## User has uploaded an invalid file
 * 
 * Invalid means: 
 * - empty
 * - not the right format (for example it's not an image)
 * - too big
 */
export default class InvalidFileUploadedError extends Error {
  constructor(details?: string) {
    const baseMessage = `The uploaded file is invalid.`
    const fullMessage = details ? `${baseMessage} DETAILS: ${details}` : baseMessage
    super(fullMessage)
  }
}