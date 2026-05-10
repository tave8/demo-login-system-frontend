import {Component, useState} from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import {AppEvent, AppEventMessage, AppEventMessageType, AppRoutes} from "../js/my_types"
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import AppNotificationBell from "./AppNotificationBell.tsx";
import NavContentAuth from "./navbar/NavContentAuth.tsx";
import NavContentSettings from "./navbar/NavContentSettings.tsx";
import NavContentForAdmin from "./navbar/NavContentForAdmin.tsx";
import NavContentForOperator from "./navbar/NavContentForOperator.tsx";
import NavContentForCoordinator from "./navbar/NavContentForCoordinator.tsx";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()



const MyNav = () => {
  const navigate = useNavigate()
  const [navExpanded, setNavExpanded] = useState(false);

  const closeNav = () => setNavExpanded(false);

  const {user} = useAuth()

  return (
      <Navbar
          expand="lg"
          expanded={navExpanded}
          onToggle={(expanded) => setNavExpanded(expanded)}
          className="bg-body-tertiary">
        <Container fluid>
          <Link
              to={user ? AppRoutes.dashboardOf(user.role) : "#"}
              onClick={closeNav}
              className="nav-item navbar-brand">
            Operavion CRM {user ? `(${user.role})` : ""}
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            {/* for admin */}
            <NavContentForAdmin setNavExpanded={setNavExpanded} />

            {/* for coordinator */}
            <NavContentForCoordinator setNavExpanded={setNavExpanded} />

            {/* for operator */}
            <NavContentForOperator setNavExpanded={setNavExpanded} />



            {/* user settings */}
            <NavContentSettings setNavExpanded={setNavExpanded} />

            {/* login & signup */}
            <NavContentAuth setNavExpanded={setNavExpanded} />

          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}



export default MyNav
