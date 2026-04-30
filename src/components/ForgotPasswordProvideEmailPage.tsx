import {Alert, Button, Col, Container, Form, Image, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import {useAuth} from "../auth/AuthContext.tsx";
import {ForgotPasswordRequestToAPI, UpdatedUserToAPI, UserFromAPI} from "../js/my_types.ts";
import UsersAPI from "../js/UsersAPI.ts";
import UnauthorizedError from "../js/exceptions/UnauthorizedError.ts";

const initialEmailData: ForgotPasswordRequestToAPI = {
    email: ""
}

interface HandleForgotPasswordRequestParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void
}


const ForgotPasswordProvideEmailPage = () => {
    const [emailData, setEmailData] = useState(initialEmailData)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9} lg={6}>
                        {/* title */}
                        <Row className="mb-3">
                            <Col>
                                <h1 className="text-center">Forgot password</h1>
                            </Col>
                        </Row>

                        {/* my profile info */}

                        {!isLoading && !isError && (
                            <>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Your email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="mary@mail.com"
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
                                            className="btn btn-primary"
                                            onClick={() => {
                                                handleForgotPasswordRequest(emailData)({ setIsLoading, setIsError })
                                            }}
                                        >
                                            Submit request
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
                        {isError && <Alert variant="danger">Something went wrong.</Alert>}
                    </Col>
                </Row>
            </Container>
        </>
    )
}


const handleForgotPasswordRequest = (emailData: ForgotPasswordRequestToAPI) => {
    return async (params: HandleForgotPasswordRequestParams) => {
        console.log(emailData, params)
        // const { logout } = params

        // const usersAPI = new UsersAPI()
        //
        // usersAPI
        //     .updateMyInfo(updatedUser)
        //     .then((userData) => {
        //         // console.log(userData)
        //         alert("successfully update my info")
        //     })
        //     .catch((err) => {
        //         if (err instanceof UnauthorizedError) {
        //             logout()
        //         } else {
        //             console.info("Error during login")
        //             console.error(err)
        //         }
        //     })
    }
}


export default ForgotPasswordProvideEmailPage