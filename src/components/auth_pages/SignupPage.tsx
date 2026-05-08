// import { Component } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
// import { Search, BellFill } from "react-bootstrap-icons"
// import { Link } from "react-router-dom"
import { useState } from "react"
import AuthAPI from "../../js/api/AuthAPI"
import {AppEvent, AppEventMessage, AppEventMessageType, AppRoutes, SignupToAPI} from "../../js/my_types"
import {Link, NavigateFunction, useNavigate} from "react-router-dom"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import BadRequestError from "../../js/exceptions/BadRequestError.ts";
import HttpError from "../../js/exceptions/HttpError.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()


interface HandleSignupParams {
  navigate: NavigateFunction
  setIsLoading: (x:boolean) => void
  setIsError: (x:boolean) => void
}

const initialFormValues: SignupToAPI = {
  legalName: "",
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
            <Row className={"mb-3"}>
              <Col>
                <h1 className="text-center">Iscriviti - Per le Aziende</h1>
              </Col>
            </Row>

            <Row>
              {/*form */}
              <Form onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignup(formValues)({ navigate, setIsError, setIsLoading });
                  }
                }}>
                {/* legal name */}
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Ragione sociale</Form.Label>
                      <Form.Control
                          type="text"
                          disabled={isLoading}
                          placeholder="La mia azienda SRL"
                          value={formValues.legalName}
                          onChange={(event) => {
                            setFormValues({
                              ...formValues,
                              legalName: event.target.value,
                            })
                          }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* firstname */}
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Nome del titolare</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={isLoading}
                        placeholder="Mario"
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
                      <Form.Label>Cognome del titolare</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={isLoading}
                        placeholder="Rossi"
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
                        placeholder="azienda@gmail.com"
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
                        placeholder="La mia password"
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
                      Iscriviti
                    </Button>
                  </Col>
                </Row>
                <Row>
                  {/* forgot password */}
                  <Col className="text-center mt-3">
                    <Link
                        to={AppRoutes.login}
                    >
                      Hai già un account?
                    </Link>
                  </Col>
                </Row>
              </Form>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const handleSignup = (formValues: SignupToAPI) => {
  return async (params: HandleSignupParams) => {
    const { navigate, setIsError, setIsLoading } = params

    const authAPI = new AuthAPI()

    setIsLoading(true)
    setIsError(false)

    authAPI
      .signup(formValues)
      .then((userData) => {
        setIsLoading(false)
        setIsError(false)


        appEventDispatcher.dispatchStandard(
            AppEvent.APP_SUCCESS,
            AppEventMessageType.SIGNUP_SUCCESS
        )

        navigate(AppRoutes.login)

      })
        .catch((err: unknown) => {
          setIsLoading(false)
          setIsError(true)

            if (err instanceof UnauthorizedError) {

              appEventDispatcher.dispatchStandard(
                  AppEvent.APP_ERROR,
                  AppEventMessageType.SIGNUP_CANNOT_USE_EMAIL
              )

            } else if (err instanceof BadRequestError) {
              const badRequest = err as BadRequestError;

              appEventDispatcher.dispatchStandard(
                  AppEvent.APP_ERROR,
                  AppEventMessageType.INVALID_FIELDS,
                  badRequest.getErrorsAsStr()
              )

            }

        })
  }
}

export default SignupPage
