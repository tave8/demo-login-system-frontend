import {Alert, Button, Col, Container, Form, Image, Row, Spinner} from "react-bootstrap";
import {use, useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {
    AppEvent, AppEventMessageType,
    AppRoutes,
    ForgotPasswordNewPasswordToAPI,
    ForgotPasswordRequestToAPI, ForgotPasswordVerifyCodeToAPI,
    UpdatedUserToAPI,
    UserFromAPI
} from "../../js/my_types.ts";
import UsersAPI from "../../js/api/UsersAPI.ts";
import UnauthorizedError from "../../js/exceptions/UnauthorizedError.ts";
import AuthAPI from "../../js/api/AuthAPI.ts";
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import NotFoundError from "../../js/exceptions/NotFoundError.ts";
import AppEventDispatcher from "../../js/AppEventDispatcher.ts";

const appEventDispatcher = AppEventDispatcher.getInstance()
const authAPI = AuthAPI.getInstance()

type RouteURLParams = {
    code: string
}

// this is what we send to the server
// when we first load the page. it answers the question:
// is this code authorized to even access the page
// where a new password can be set?
// the difference between this payload and the other one (with the new password)
// is that with this payload, we first verify IF the user can even access the
// page, whereas with the other payload, the user has clicked submit
// and is sending a new password (and we verify the authorization code again)
const authorizationCode: ForgotPasswordVerifyCodeToAPI = {
    code: ""
}

// when the user submits a new password, we still provide the authorization code
const initialNewPasswordData: ForgotPasswordNewPasswordToAPI = {
    newPassword: "",
    code: ""
}

interface HandleForgotPasswordNewPasswordParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void
    navigate: NavigateFunction
}


export default function ForgotPasswordSetNewPasswordPage ()  {
    const [newPasswordData, setNewPasswordData] = useState(initialNewPasswordData)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const params = useParams<RouteURLParams>()
    const navigate = useNavigate()

    // when page is first loaded, verify that
    // the code in the URL route is valid
    useEffect(() => {

        // now this component is loaded, so we can
        // retrieve the code in the URL route

        const code = params.code

        // if the code does not exist,
        // we redirect the user
        if(!code) {
            navigate(AppRoutes.login)
            return
        }

        // we set the authorization code
        // we send this to the server, so
        // we know immediately whether the user
        // can even access this page or not
        authorizationCode.code = code


        setIsLoading(true)
        setIsError(false)

        authAPI
            .verifyForgotPasswordCode(authorizationCode)
            .then((msgFromServer) => {
                // console.log(userData)
                // we set the
                setIsLoading(false)
                setIsError(false)

                // we set the code in the payload that will be sent
                // when the user submits the new password
                setNewPasswordData({
                    ...newPasswordData,
                    code: code
                })

            })
            .catch((err: unknown) => {
                if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
                    setIsLoading(false)
                    setIsError(true)
                    setErrorMsg("Non sei autorizzato ad accedere a questa pagina.")
                } else {
                    setIsLoading(false)
                    setIsError(true)
                    setErrorMsg("An unknown error occurred.")
                    console.error(err)
                }
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
                                <h1 className="text-center">Imposta la nuova password</h1>
                            </Col>
                        </Row>

                        {/* form */}
                        {!isLoading && !isError && (

                            <Form onSubmit={(e) => {
                                e.preventDefault()
                                handleForgotPasswordNewPassword(newPasswordData)({ setIsLoading, setIsError, navigate })
                            }}>


                                {/* info alert */}
                                <Row>
                                    <Alert variant={"primary"}>
                                        <span>🔒 Per la tua sicurezza, questa pagina può essere aperta una sola volta e scadrà a breve.
                                            Quando imposti la nuova password o chiudi questa pagina, il link verrà rimosso.</span>
                                    </Alert>
                                </Row>

                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Nuova password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                disabled={isLoading}
                                                placeholder="Inserisci la tua nuova password"
                                                value={newPasswordData.newPassword}
                                                onChange={(event) => {
                                                    setNewPasswordData({
                                                        ...newPasswordData,
                                                        newPassword: event.target.value,
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
                                            Imposta nuova password
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>

                        )}


                        {/* is error */}
                        {isError && <Alert variant="danger">{errorMsg}</Alert>}
                    </Col>
                </Row>
            </Container>
        </>
    )
}


const handleForgotPasswordNewPassword = (newPassword: ForgotPasswordNewPasswordToAPI) => {
    return async (params: HandleForgotPasswordNewPasswordParams) => {

        const {navigate, setIsLoading, setIsError} = params

        setIsLoading(true)
        setIsError(false)

        authAPI
            .setNewPasswordIfAuthorized(newPassword)
            .then((msgFromServer) => {

                setIsLoading(false)
                setIsError(false)

                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.SET_PASSWORD_SUCCESS
                )

                // user has successfully set a new password,
                // send them to login page
                navigate(AppRoutes.login)
            })
            .catch((err: unknown) => {

                setIsLoading(false)
                setIsError(true)

                if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {

                    appEventDispatcher.dispatchStandard(
                        AppEvent.APP_ERROR,
                        AppEventMessageType.CANNOT_SET_PASSWORD_NOW
                    )

                }

            })
    }
}
