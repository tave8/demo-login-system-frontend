// import { Component } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
// import { Search, BellFill } from "react-bootstrap-icons"
// import { Link } from "react-router-dom"
import { useState } from "react"
import AuthAPI from "../../js/api/AuthAPI"
import { AppRoutes, SignupToAPI } from "../../js/my_types"
import {Link, NavigateFunction, useNavigate} from "react-router-dom"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import BadRequestError from "../../js/exceptions/BadRequestError.ts";
import HttpError from "../../js/exceptions/HttpError.ts";

interface handleSignupParams {
  navigate: NavigateFunction
  setIsLoading: (x:boolean) => void
  setIsError: (x:boolean) => void
}

const initialFormValues: SignupToAPI = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
}

const SignupPage = () => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

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

            {/*form */}
            <Form onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignup(formValues)({ navigate, setIsError, setIsLoading });
                }
              }}>
              {/* firstname */}
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Firstname</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      handleSignup(formValues)({ navigate, setIsError, setIsLoading })
                    }}
                  >
                    Sign up
                  </Button>
                </Col>
              </Row>
              <Row>
                {/* forgot password */}
                <Col className="text-center mt-3">
                  <Link
                      to={AppRoutes.login}
                  >
                    Already have an account?
                  </Link>
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
    const { navigate, setIsError, setIsLoading } = params

    const authAPI = new AuthAPI()

    setIsLoading(true)
    setIsError(false)

    authAPI
      .signup(formValues)
      .then((userData) => {
        setIsLoading(false)
        setIsError(false)

        window.dispatchEvent(new CustomEvent("signup-success", {
          detail: "Successful signup. Check your inbox: We've just "
              +"sent you an email to verify that it's you."
        }))

        navigate(AppRoutes.login)
      })
        .catch((err: unknown) => {
          setIsLoading(false)
          setIsError(true)

            if (err instanceof UnauthorizedError) {

              window.dispatchEvent(new CustomEvent("app-error", {
                detail: "You cannot use this email."
              }))

            } else if (err instanceof BadRequestError) {
              const badRequest = err as BadRequestError;
              alert("Some fields are invalid. Details: " + badRequest.getErrorsAsStr())
            }

        })
  }
}

export default SignupPage
