import { jwtDecode } from "jwt-decode"

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("token")
  if (!token) return false
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    return Date.now() < exp * 1000
  } catch {
    return false
  }
}
