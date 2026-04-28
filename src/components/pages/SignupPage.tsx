// import { Component } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
// import { Search, BellFill } from "react-bootstrap-icons"
// import { Link } from "react-router-dom"
import { useState } from "react"
import AuthAPI from "../../js/AuthAPI"
import { AppRoutes, SignupToAPI } from "../../js/my_types"
import { NavigateFunction, useNavigate } from "react-router-dom"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"

interface handleSignupParams {
  navigate: NavigateFunction
}

const initialFormValues: SignupToAPI = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
}

const SignupPage = () => {
  const [formValues, setFormValues] = useState(initialFormValues)

  const navigate = useNavigate()


  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            {/* title */}
            <Row>
              <Col>
                <h1 className="text-center">Sign up</h1>
              </Col>
            </Row>
            <Form>
              {/* firstname */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Firstname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="My firstname"
                      value={formValues.firstname}
                      onChange={(event) => {
                        setFormValues({
                          ...formValues,
                          firstname: event.target.value,
                        })
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* lastname */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Lastname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="My lastname"
                      value={formValues.lastname}
                      onChange={(event) => {
                        setFormValues({
                          ...formValues,
                          lastname: event.target.value,
                        })
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* email */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={formValues.email}
                      onChange={(event) => {
                        setFormValues({
                          ...formValues,
                          email: event.target.value,
                        })
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* password */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Your password"
                      value={formValues.password}
                      onChange={(event) => {
                        setFormValues({
                          ...formValues,
                          password: event.target.value,
                        })
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* submit */}
              <Row>
                <Col className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleSignup(formValues)({ navigate })
                    }}
                  >
                    Sign up
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const handleSignup = (formValues: SignupToAPI) => {
  return async (params: handleSignupParams) => {
    const { navigate } = params

    const authAPI = new AuthAPI()

    authAPI
      .signup(formValues)
      .then((userData) => {
        alert("Successful signup. Check your inbox: We've just "
              +"sent you an email to verify that it's you.")

        // console.log("successful signup, navigating to login page")
        navigate(AppRoutes.login)
      })
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          alert("You cannot use this email.")
        } else {
          console.info("Error during signup")
          console.error(err)
        }
      })
  }
}

export default SignupPage
