import {Link, useNavigate} from "react-router-dom";
import {AppRoutes, UserRole} from "../../js/my_types.ts";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav} from "react-bootstrap";


interface Props {
    setNavExpanded: (x: boolean) => void
}

export default function NavContentForOperator({ setNavExpanded }: Props) {
    const navigate = useNavigate()

    const { login, logout, authenticated, getUser } = useAuth()

    const user = getUser()

    const closeNav = () => setNavExpanded(false);

    return (
        <>

            {authenticated && user && user.role == UserRole.OPERATOR && (

                <Nav className="me-auto">

                    {authenticated && (
                        <Link
                            to={AppRoutes.dashboard}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            I miei turni
                        </Link>
                    )}

                </Nav>

            )}

        </>
    )
}