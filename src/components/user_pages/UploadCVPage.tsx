import { useState } from "react"
import { Container, Row, Col, Form, Button, Spinner, Alert, Image } from "react-bootstrap"
import {MaybeFile, UpdatedUserToAPI, UserFromAPI} from "../../js/my_types"
import UsersAPI from "../../js/api/UsersAPI"
import UnauthorizedError from "../../js/exceptions/UnauthorizedError"
import { useAuth } from "../../auth/AuthContext"
import FileHelper from "../../js/helpers/FileHelper"
import InvalidFileUploadedError from "../../js/exceptions/InvalidFileUploadedError"
import ServerError from "../../js/exceptions/ServerError"
import FileExtractionAPI from "../../js/api/FileExtractionAPI.ts";
import BadRequestError from "../../js/exceptions/BadRequestError.ts";


interface HandleUploadCVParams {
    setIsLoading: (x: boolean) => void
    setIsError: (x: boolean) => void
}

const UploadCvPage = () => {
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
                                <h1 className="text-center">Upload CV</h1>
                            </Col>
                        </Row>

                        {/* upload CV */}

                        {!isLoading && !isError && (
                            <>
                                <Row className="g-3">
                                    <Col xs={12} className="text-center">
                                        <Row className="d-flex flex-column align-items-center g-3">
                                            <Col xs={12} className="text-center">
                                                {/* Cv upload */}
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="file"
                                                        size="sm"
                                                        accept=".pdf,application/pdf"
                                                        onChange={(event) => {
                                                            const file: MaybeFile = event.target.files?.[0]
                                                            // if (file) {
                                                            //     setAvatarImage(file)
                                                            //     handleUploadAvatarImage(file)({ setUserData, setIsLoading, setIsError, logout })
                                                            // }
                                                            if(file) {
                                                                handleUploadCV(file)({ setIsError, setIsLoading })
                                                            }
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
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



const handleUploadCV = (cvFile: File) => {
    return async (params: HandleUploadCVParams) => {
        const { setIsError, setIsLoading } = params
        //
        // console.log(cvFile)

        // check that CV passes all checks
        try {
            FileHelper.requireValidPdf(cvFile)
        } catch (err) {
            if (err instanceof InvalidFileUploadedError) {
                // ideally, you could clean the input field here
                alert(err.message)
            }
            // if we ever enter the catch block, we stop
            return
        }

        //
        // // all checks passed, now we can upload the image
        //
        const fileExtractionAPI = new FileExtractionAPI()

        setIsLoading(true)
        setIsError(false)

        fileExtractionAPI
            .extractCV(cvFile)
            .then((userData) => {
                setIsLoading(false)
                setIsError(false)
                // setUserData(userData)
            })
            .catch((err) => {
                setIsLoading(false)
                setIsError(true)
                if (err instanceof UnauthorizedError) {
                    // logout()
                } else if (err instanceof BadRequestError) {
                    alert("Error: " + err.getErrorsAsStr())
                }
                else if (err instanceof ServerError) {
                    alert("There was a problem with the server.")
                } else {
                    console.info("Error during avatar image upload")
                    console.error(err)
                }
            })
    }
}

export default UploadCvPage
