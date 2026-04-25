import { Component, useState } from "react"
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image, Dropdown, Form, InputGroup, Button, Spinner, Alert } from "react-bootstrap"
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
  const [isError, setIsError] = useState(false)

  // fetch user data each time
  // the component is rendered
  useState(() => {
    const usersAPI = new UsersAPI()

    setIsLoading(true)
    setIsError(false)
    usersAPI
      .getMyInfo()
      .then((userData) => {
        setIsLoading(false)
        setIsError(false)
        setUserData(userData)
        console.log(userData)
      })
      .catch((err) => {
        setIsLoading(false)
        setIsError(true)
        console.info("Error during getting user info")
        console.error(err)
      })
  }, [])

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={9} lg={6}>
            {/* title */}
            <Row className="mb-3">
              <Col>
                <h1 className="text-center">My profile</h1>
              </Col>
            </Row>

            {/* my profile info */}

            {!isLoading && !isError && (
              <>
                <Row className="g-3">
                  <Col xs={12} md={3} className="text-center">
                    <Image src={userData.avatarUrl} />
                  </Col>
                  <Col md={9}>
                    {/* full name */}
                    <p className="fs-4">
                      Fullname: {userData.firstname} {userData.lastname}
                    </p>
                    <p className="fs-4">Email: {userData.email}</p>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xs={12} className="text-center">
                    <Link to="/me/edit" className="btn btn-primary">
                      Edit my profile
                    </Link>
                  </Col>
                </Row>
              </>
            )}

            {/* is loading */}
            {isLoading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}

            {/* is error */}
            {isError && <Alert variant="danger">Something went wrong.</Alert>}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SeeMyProfilePage
