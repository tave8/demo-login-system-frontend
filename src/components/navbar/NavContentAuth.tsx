import {Nav, NavDropdown} from "react-bootstrap";
import AppNotificationBell from "../AppNotificationBell.tsx";
import {AppRoutes} from "../../js/my_types.ts";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";

interface Props {
    setNavExpanded: (x: boolean) => void
}

export default function NavContentAuth({ setNavExpanded }: Props) {

    const navigate = useNavigate()

    const { login, logout, authenticated } = useAuth()

    const closeNav = () => setNavExpanded(false);

    return (
        <>
            {/* login / signup */}
            {!authenticated && (
                <Nav className="end">
                    <Link
                        to={AppRoutes.loginOperator}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Entra (operatore)
                    </Link>
                    <Link
                        to={AppRoutes.login}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Entra (manager)
                    </Link>
                    <Link
                        to={AppRoutes.signup}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Iscriviti (azienda)
                    </Link>
                </Nav>
            )}
        </>
    )
}