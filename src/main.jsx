import { createRoot } from "react-dom/client"
import { AuthProvider } from "./auth/AuthContext.tsx"
import App from "./App.jsx"
import "./js/startup_logs.ts"

createRoot(document.getElementById("root")).render(
  <>
    <AuthProvider>
      <App />
    </AuthProvider>
  </>,
)
