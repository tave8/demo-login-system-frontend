import {useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {ClientToAPI, Language} from "../../../js/my_types.ts";
import GeocodingAPI from "../../../js/api/GeocodingAPI.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const geocodingAPI = GeocodingAPI.getInstance()


interface HandleAddClientParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
}

const initialFormValues: ClientToAPI = {
    legalName: "",
    legalAddress: "",
    legalAddressLat: 0,
    legalAddressLon: 0,
    vat: "",
    email: "",
    phone: ""
}

export default function AddClientPage () {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={6} lg={4}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi cliente</h1>
                            </Col>
                        </Row>

                        <Row>
                            {/* form */}
                            <Form onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddClient(formValues)({ setIsError, setIsLoading });
                                }
                            }}>
                                {/* legal name */}
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Ragione sociale</Form.Label>
                                            <Form.Control
                                                disabled={isLoading}
                                                type="text"
                                                placeholder="Azienda SRL"
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

                                {/* phone */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="Telefono"
                                            value={formValues.phone}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    phone: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* email */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="email"
                                            placeholder="Email"
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


                                {/* VAT */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>P.IVA</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="Partita IVA"
                                            value={formValues.vat}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    vat: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* legal address */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Indirizzo sede legale</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="via Roma, Milano"
                                            value={formValues.legalAddress}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    legalAddress: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>


                                {/* submit */}
                                <Col className="text-center">
                                    <Button
                                        disabled={isLoading}
                                        variant="primary"
                                        onClick={() => {
                                            handleAddClient(formValues)({ setIsError, setIsLoading });
                                        }}
                                    >
                                        Aggiungi cliente
                                    </Button>
                                </Col>
                            </Form>
                        </Row>


                    </Col>
                </Row>
            </Container>
        </>
    )
}

const handleAddClient = (formValues: ClientToAPI) => {
    return async (params: HandleAddClientParams) => {
        console.log(formValues, params)

        geocodingAPI
            .autocompleteInLocalLanguage("san calogero, vibo valentia")
            .then((result) => {

                console.log(result)
            })
            .catch(err => {

            })

        // const { login, logout, authenticated, navigate, setIsError, setIsLoading } = params
        //
        // const authAPI = new AuthAPI()
        //
        // setIsLoading(true)
        // setIsError(false)
        //
        // authAPI
        //     .login(formValues)
        //     .then((loginInfo) => {
        //
        //         setIsLoading(false)
        //         setIsError(false)
        //
        //         const { accessToken } = loginInfo
        //
        //         login(accessToken, loginInfo.user)
        //
        //         // after successful login, where route the user
        //         // is redirected to
        //         navigate(AppRoutes.dashboardOf(loginInfo.user.role))
        //
        //         appEventDispatcher.dispatchStandard(
        //             AppEvent.APP_SUCCESS,
        //             AppEventMessageType.LOGIN_SUCCESS
        //         )
        //
        //     })
        //     .catch((err) => {
        //
        //         setIsLoading(false)
        //         setIsError(true)
        //
        //         if (err instanceof UnauthorizedError) {
        //
        //             appEventDispatcher.dispatchStandard(
        //                 AppEvent.APP_ERROR,
        //                 AppEventMessageType.WRONG_CREDENTIALS
        //             )
        //
        //         } else if (err instanceof ForbiddenError) {
        //
        //             appEventDispatcher.dispatchStandard(
        //                 AppEvent.APP_ERROR,
        //                 AppEventMessageType.MUST_VERIFY_EMAIL
        //             )
        //
        //         }
        //     })
    }

}

