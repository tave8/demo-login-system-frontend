import {Link, useNavigate} from "react-router-dom";
import {AppRoutes, UserRole} from "../../js/my_types.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {Nav, NavDropdown} from "react-bootstrap";
import {
    People,
    PersonPlus,
    Building,
    BuildingAdd,
    GeoAlt,
    GeoAltFill,
    ListCheck,
    ListUl,
    PlusCircle,
    Calendar,
    CalendarPlus,
    File, FileEarmarkSpreadsheet, Speedometer2
} from 'react-bootstrap-icons'


interface Props {
    setNavExpanded: (x: boolean) => void
}

export default function AdminNav({ setNavExpanded }: Props) {
    const navigate = useNavigate()

    const { login, logout, authenticated, user } = useAuth()

    const closeNav = () => setNavExpanded(false);


    return (
        <>
            {/* if the role of this user is admin, show this */}

            {authenticated && user && (user.role == UserRole.ADMIN) && (

                <Nav className="me-auto">

                    <Link
                        to={AppRoutes.dashboardOf(user.role)}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Panoramica
                    </Link>

                    {/* TEAM */}
                    <NavDropdown title="Team" id="basic-nav-dropdown" align="end">
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.users); closeNav() }}>
                            Il mio Team
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addUser); closeNav() }}>
                            Aggiungi utente
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* CLIENTS */}
                    <NavDropdown title="Clienti" id="basic-nav-dropdown" align="end">
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.clients); closeNav() }}>
                            Vedi clienti
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addClient); closeNav() }}>
                            Aggiungi cliente
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* CLIENTS ADDRESSES */}
                    <NavDropdown title="Cantieri" id="basic-nav-dropdown" align="end">
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.clientAddresses); closeNav() }}>
                            Vedi cantieri
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addClientAddress); closeNav() }}>
                            Aggiungi cantiere
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* TASKS */}
                    <NavDropdown title="Attività" id="basic-nav-dropdown" align="end">
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addChecklistToClientAddress); closeNav() }}>
                            Aggiungi scheda a sede cliente
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.checklists); closeNav() }}>
                            Vedi schede
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addChecklist); closeNav() }}>
                            Aggiungi scheda
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.tasks); closeNav() }}>
                            Vedi attività
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addTask); closeNav() }}>
                            Aggiungi attività
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* SHIFTS */}
                    <NavDropdown title="Turni" id="basic-nav-dropdown" align="end">
                        <NavDropdown.Item onClick={() => { navigate(AppRoutes.addShift); closeNav() }}>
                            Aggiungi turno
                        </NavDropdown.Item>
                    </NavDropdown>


                    {/* REPORTS */}
                    <Link
                        to={AppRoutes.reports}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Report
                    </Link>

                    {/* AUTOMATIONS */}
                    <Link
                        to={AppRoutes.automations}
                        onClick={closeNav}
                        className="nav-item nav-link">
                        Automazioni
                    </Link>

                </Nav>


            )}

        </>
    )
}