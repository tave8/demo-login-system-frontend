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

            {/* CV - UPLOAD */}
            {authenticated && (
                <Link to={AppRoutes.uploadCV} className="nav-item nav-link">
                  Upload CV
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

            {/* <Nav.Link href="#home">Home</Nav.Link> */}

            {/* <Nav.Link href="#link">Link</Nav.Link> */}

            {authenticated && (
              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>

                {/* my profile */}
                <NavDropdown.Item as={Link} to={AppRoutes.myProfile}>
                  My profile
                </NavDropdown.Item>

                {/* divider */}
                <NavDropdown.Divider />

                {/* logout */}
                <NavDropdown.Item
                    onClick={() => {
                      handleLogout()({ login, logout, authenticated, navigate })
                    }}>
                    Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}


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
