import { Component, useState } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button } from "react-bootstrap"
import { Search, BellFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import type { UserDataType } from "../../js/my_types"
import UsersAPI from "../../js/UsersAPI"

const initialUserData: UserDataType = {
  firstname: "",
  lastname: "",
  email: "",
  avatarUrl: "",
}

const SeeMyProfilePage = () => {
  const [userData, setUserData] = useState(initialUserData)
  const [isLoading, setIsLoading] = useState(true)

  // fetch user data each time
  // the component is rendered
  useState(() => {
    const usersAPI = new UsersAPI()
    usersAPI
      .getMyInfo()
      .then((userData) => {
        console.log(userData)
      })
      .catch((err) => {
        console.info("Error during getting user info")
        console.error(err)
      })
  }, [])

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            {/* title */}
            <Row>
              <Col>
                <h1 className="text-center">My profile</h1>
              </Col>
            </Row>
            {/* my profile info */}
            <Row>
              <Col>
                <p>my profile info is here</p>

                <Link to="/me/edit" className="btn btn-primary">
                  Edit my profile
                </Link>
              </Col>
              <Col></Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SeeMyProfilePage
