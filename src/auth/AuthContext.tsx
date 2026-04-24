import { createContext, useContext, useState } from "react";
import { isLoggedIn } from "./isLoggedIn";

interface AuthContextType {
    authenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean>(isLoggedIn);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};