import {Component, useState} from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import {AppEvent, AppEventMessage, AppEventMessageType, AppRoutes} from "../js/my_types"
import AppEventDispatcher from "../js/AppEventDispatcher.ts";
import AppNotificationBell from "./AppNotificationBell.tsx";
import AppNavContentAuth from "./navbar/AppNavContentAuth.tsx";
import AppNavContentSettings from "./navbar/AppNavContentSettings.tsx";
import AppNavContentForAdmin from "./navbar/AppNavContentForAdmin.tsx";
import AppNavContentForOperator from "./navbar/AppNavContentForOperator.tsx";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()



const MyNav = () => {
  const navigate = useNavigate()
  const [navExpanded, setNavExpanded] = useState(false);

  const { login, logout, authenticated } = useAuth()

  const closeNav = () => setNavExpanded(false);

  return (
      <Navbar
          expand="lg"
          expanded={navExpanded}
          onToggle={(expanded) => setNavExpanded(expanded)}
          className="bg-body-tertiary">
        <Container fluid>
          <Link
              to={AppRoutes.dashboard}
              onClick={closeNav}
              className="nav-item navbar-brand">
            Operavion CRM
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            {/* for admin */}
            <AppNavContentForAdmin />

            {/* for coordinator */}
            {/* ..add here.. */}

            {/* for operator */}
            <AppNavContentForOperator />


            {/* user settings */}
            <AppNavContentSettings />

            {/* login & signup */}
            <AppNavContentAuth />

          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}



export default MyNav
