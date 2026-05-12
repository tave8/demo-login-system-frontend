import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { isLoggedIn } from "./isLoggedIn"
import { AppRoutes } from "../js/my_types"
import {App} from "react-bootstrap-icons";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { authenticated, logout, getUserFromLocalStorage } = useAuth()
  const navigate = useNavigate()

  const user = getUserFromLocalStorage()

  /**
   * Gets triggered at each route change.
   * Makes sure that the user is logged in
   * every time the user changes routes.
   */
  useEffect(() => {

    if (authenticated && !isLoggedIn()) {
      alert("You've been logged out")
      logout()
      // if the user is not logged in,
      // they are redirected to login
      navigate(AppRoutes.login)
    }
  }, [location])

  return children
}
