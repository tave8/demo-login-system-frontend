import {Link, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../js/my_types.ts";
import {useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav} from "react-bootstrap";

export default function AppNavContentForAdmin() {
    const navigate = useNavigate()
    const [navExpanded, setNavExpanded] = useState(false);

    const { login, logout, authenticated, user } = useAuth()

    const closeNav = () => setNavExpanded(false);

    console.log(user)

    return (
        <>
            {/* if the role of this user is admin, show this */}

            <Nav className="me-auto">

                {authenticated && (
                    <Link
                        to={AppRoutes.dashboard}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Oggi
                    </Link>
                )}

                {authenticated && (
                    <Link
                        to={AppRoutes.myArticles}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Turni
                    </Link>
                )}

                {authenticated && (
                    <Link
                        to={AppRoutes.addMyArticle}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Clienti
                    </Link>
                )}

                {authenticated && (
                    <Link
                        to={AppRoutes.uploadCV}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Team
                    </Link>
                )}

                {authenticated && (
                    <Link
                        to={AppRoutes.uploadCV}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Attività
                    </Link>
                )}

                {authenticated && (
                    <Link
                        to={AppRoutes.uploadCV}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Report
                    </Link>
                )}

            </Nav>
        </>
    )
}