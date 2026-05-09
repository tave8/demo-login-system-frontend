import {Link, useNavigate} from "react-router-dom";
import {AppRoutes, UserRole} from "../../js/my_types.ts";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav} from "react-bootstrap";

interface Props {
    setNavExpanded: (x: boolean) => void
}

export default function NavContentForAdmin({ setNavExpanded }: Props) {
    const navigate = useNavigate()

    const { login, logout, authenticated, getUser } = useAuth()

    const user = getUser()

    const closeNav = () => setNavExpanded(false);


    return (
        <>
            {/* if the role of this user is admin, show this */}

            {authenticated && user && user.role == UserRole.ADMIN && (

                <Nav className="me-auto">

                        <Link
                            to={AppRoutes.dashboard}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Oggi
                        </Link>

                        <Link
                            to={AppRoutes.myArticles}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Turni
                        </Link>

                        <Link
                            to={AppRoutes.addMyArticle}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Clienti
                        </Link>

                        <Link
                            to={AppRoutes.uploadCV}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Team
                        </Link>

                        <Link
                            to={AppRoutes.uploadCV}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Attività
                        </Link>

                        <Link
                            to={AppRoutes.uploadCV}
                            onClick={closeNav}
                            className="nav-item nav-link">
                            Report
                        </Link>

                </Nav>


            )}

        </>
    )
}