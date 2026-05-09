import {Link, useNavigate} from "react-router-dom";
import {AppRoutes} from "../js/my_types.ts";
import {useState} from "react";
import {useAuth} from "../auth/AuthContext.tsx";

export default function AppNavContentAdmin() {
    const navigate = useNavigate()
    const [navExpanded, setNavExpanded] = useState(false);

    const { login, logout, authenticated } = useAuth()

    const closeNav = () => setNavExpanded(false);


    return (
        <>

        </>
    )
}