import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuth()
  return authenticated ? <Navigate to="/me" /> : children
}
