export default class UnauthorizedError extends Error {
  constructor(details?: string) {
    super(details ? `You are not authorized. DETAILS: ${details}` : `You are not authorized.`)
  }
}
