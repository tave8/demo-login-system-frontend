import { Component } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link, useNavigate, NavigateFunction } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import { AppRoutes } from "../js/my_types"

interface handleLogoutParams {
  login: (token: string) => void
  logout: () => void
  authenticated: boolean
  navigate: NavigateFunction
}

const MyNav = () => {
  const navigate = useNavigate()

  const { login, logout, authenticated } = useAuth()

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Link to={AppRoutes.home} className="nav-item navbar-brand">
          Demo Login System
        </Link>
        {/* <Navbar.Brand href="#home">Weather app</Navbar.Brand>
         */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Link to={AppRoutes.home} className="nav-item nav-link">
              Home
            </Link> */}

            {/* MY ARTICLES - SEE */}
            {authenticated && (
              <Link to={AppRoutes.myArticles} className="nav-item nav-link">
                My articles
              </Link>
            )}

            {/* MY ARTICLES - ADD */}
            {authenticated && (
              <Link to={AppRoutes.addMyArticle} className="nav-item nav-link">
                Add article
              </Link>
            )}

            {/* MY PROFILE */}
            {authenticated && (
              <Link to={AppRoutes.myProfile} className="nav-item nav-link">
                My profile
              </Link>
            )}

            {/* LOGIN */}
            {!authenticated && (
              <Link to={AppRoutes.login} className="nav-item nav-link">
                Login
              </Link>
            )}

            {/* SIGN UP */}
            {!authenticated && (
              <Link to={AppRoutes.signup} className="nav-item nav-link">
                Sign up
              </Link>
            )}

            {/* LOGOUT */}
            {authenticated && (
              <span
                className="nav-item nav-link"
                onClick={() => {
                  handleLogout()({ login, logout, authenticated, navigate })
                }}
                style={{ cursor: "pointer" }}
              >
                Logout
              </span>
            )}

            {/* <Nav.Link href="#home">Home</Nav.Link> */}

            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

const handleLogout = () => {
  return (params: handleLogoutParams) => {
    const { login, logout, authenticated, navigate } = params
    // console.log("logging out..")
    // console.log("is logged in: " + authenticated)
    alert("successful logout")
    logout()
    navigate(AppRoutes.login)
  }
}

export default MyNav
