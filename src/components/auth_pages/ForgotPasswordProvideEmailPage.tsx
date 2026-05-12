import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import {AppEvent, AppEventMessageType, AppRoutes, ForgotPasswordRequestToAPI} from "../../js/my_types.ts";
import UnauthorizedError from "../../js/exceptions/UnauthorizedError.ts";
import AuthAPI from "../../js/api/AuthAPI.ts";
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";
import {NavigateFunction, useNavigate} from "react-router-dom";

const appEventDispatcher = AppEventDispatcher.getInstance()
const authAPI = AuthAPI.getInstance()

const initialEmailData: ForgotPasswordRequestToAPI = {
    email: ""
}

interface HandleForgotPasswordRequestParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void,
    navigate: NavigateFunction
}


const ForgotPasswordProvideEmailPage = () => {
    const [emailData, setEmailData] = useState(initialEmailData)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const navigate = useNavigate()

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9} lg={6}>
                        {/* title */}
                        <Row className="mb-3">
                            <Col>
                                <h1 className="text-center">Crea una nuova password</h1>
                            </Col>
                        </Row>

                        {/* provide email */}

                        <Form onSubmit={(e) => {
                            e.preventDefault()
                            handleForgotPasswordRequest(emailData)({ setIsLoading, setIsError, navigate })
                        }}>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>La tua email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            disabled={isLoading}
                                            placeholder="nome.cognome@gmail.com"
                                            value={emailData.email}
                                            onChange={(event) => {
                                                setEmailData({
                                                    ...emailData,
                                                    email: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col xs={12} className="text-center">
                                    <Button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        Invia
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


const handleForgotPasswordRequest = (emailData: ForgotPasswordRequestToAPI) => {
    return async (params: HandleForgotPasswordRequestParams) => {

        const {setIsLoading,setIsError, navigate} = params

        setIsLoading(true)
        setIsError(false)

        authAPI
            .sendForgotPasswordRequest(emailData)
            .then((msgFromServer) => {

                setIsLoading(false)
                setIsError(false)

                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.AUTHORIZATION_SET_PASSWORD_SUCCESS
                )

                navigate(AppRoutes.login)

            })
            .catch((err: unknown) => {

                setIsLoading(false)
                setIsError(true)

                if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
                    console.log(err.message)

                    appEventDispatcher.dispatchStandard(
                        AppEvent.APP_ERROR,
                        AppEventMessageType.CANNOT_SET_PASSWORD_NOW
                    )

                }
            })
    }
}


export default ForgotPasswordProvideEmailPage