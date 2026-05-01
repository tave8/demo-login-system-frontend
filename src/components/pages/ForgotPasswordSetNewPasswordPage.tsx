import {Alert, Button, Col, Container, Form, Image, Row, Spinner} from "react-bootstrap";
import {use, useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext.tsx";
import {
    AppRoutes,
    ForgotPasswordNewPasswordToAPI,
    ForgotPasswordRequestToAPI, ForgotPasswordVerifyCodeToAPI,
    UpdatedUserToAPI,
    UserFromAPI
} from "../../js/my_types.ts";
import UsersAPI from "../../js/UsersAPI.ts";
import UnauthorizedError from "../../js/exceptions/UnauthorizedError.ts";
import AuthAPI from "../../js/AuthAPI.ts";
import ForbiddenError from "../../js/exceptions/ForbiddenError.ts";
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import NotFoundError from "../../js/exceptions/NotFoundError.ts";

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


const ForgotPasswordSetNewPasswordPage = () => {
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
            navigate(AppRoutes.home)
            return
        }

        // we set the authorization code
        // we send this to the server, so
        // we know immediately whether the user
        // can even access this page or not
        authorizationCode.code = code

        // console.log(code)
        const authAPI = new AuthAPI();

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
                    setErrorMsg("You are not authorized to access this page.")
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
                                <h1 className="text-center">Set new password</h1>
                            </Col>
                        </Row>

                        {/* my profile info */}

                        {!isLoading && !isError && (
                            <>
                                {/* info alert */}
                                <Row>
                                    <Alert variant={"primary"}>
                                        <span>🔒 For your safety, this page can only be opened once and will soon expire.
                                            When you set your new password or close this page, it will also be removed.</span>
                                    </Alert>
                                </Row>

                                {/* the form */}
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Type in your new password"
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
                                            className="btn btn-primary"
                                            onClick={() => {
                                                handleForgotPasswordNewPassword(newPasswordData)({ setIsLoading, setIsError, navigate })
                                            }}
                                        >
                                            Set new password
                                        </Button>
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
                        {isError && <Alert variant="danger">{errorMsg}</Alert>}
                    </Col>
                </Row>
            </Container>
        </>
    )
}


const handleForgotPasswordNewPassword = (newPassword: ForgotPasswordNewPasswordToAPI) => {
    return async (params: HandleForgotPasswordNewPasswordParams) => {

        const {navigate} = params

        const authAPI = new AuthAPI();

        authAPI
            .setNewPasswordIfAuthorized(newPassword)
            .then((msgFromServer) => {
                // console.log(userData)
                alert(msgFromServer.message)
                // user has successfully set a new password,
                // send them to login page
                navigate(AppRoutes.login)
            })
            .catch((err: unknown) => {
                if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
                    // logout()
                    console.log(err.message)
                    alert("You cannot set a new password right now, maybe your authorization has expired.")
                } else {
                    console.info("Error during forgot password reset")
                    console.error(err)
                }
            })
    }
}


export default ForgotPasswordSetNewPasswordPage