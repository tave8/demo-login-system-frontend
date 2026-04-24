import { jwtDecode } from "jwt-decode"

/**
 * Checks whether the user is logged in.
 * The access token in local storage gets checked
 * for its expiration date.
 */
export const isLoggedIn = (): boolean => {
  // console.log("CALLED IS LOGGED IN FUNCTION TO CHECK JWT")
  const token = localStorage.getItem("token")
  if (!token) return false
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    return Date.now() < exp * 1000
  } catch {
    return false
  }
}
