import {useState} from "react";
import {
    AppEvent,
    AppEventMessageType,
    AppRoutes, ClientAddressFromAPI,
    ContractExpectationFromAPI, DAY_LABELS, DayOfWeek,
    UpdatedContractExpectationToAPI
} from "../../../../js/my_types.ts";
import {useNavigate, useParams} from "react-router-dom";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import BadRequestError from "../../../../js/exceptions/BadRequestError.ts";
import AppEventDispatcher from "../../../../js/AppEventDispatcher.ts";
import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import AddShiftForm from "../add_shift/AddShiftForm.tsx";
import LanguageHelper from "../../../../js/helpers/LanguageHelper.ts";

const appEventDispatcher = AppEventDispatcher.getInstance()

const clientAddressesAPI = ClientAddressesAPI.getInstance()

type RouteURLParams = {
    clientAddressId: string
}

/**
 * What we get from the API.
 */
const initialClientAddress: ClientAddressFromAPI = {
    id: "",
    clientId: "",
    addressId: "",
    clientName: "",
    addressDisplayName: "",
    addressName:  "",
    addressLat: 0,
    addressLon: 0,
    contractExpectation: {
        exists: false,
        pending: false,
        success: false,
        failed: false,
        detail: {
            id: "",
            clientAddressId: "",
            state: "",
            expectations: "",
            processedAt: ""
        }
    }
}

/**
 * What we send to the API.
 */
const initialContractExpectation: UpdatedContractExpectationToAPI = {
    expectations: ""
}


export default function ContractExpectationPage() {

    const [clientAddress, setClientAddress] = useState(initialClientAddress)
    const [updatedContractExpectation, setUpdatedContractExpectation] = useState(initialContractExpectation)
    // const [isLoading, setIsLoading] = useState(true)
    // const [isError, setIsError] = useState(false)

    const params = useParams<RouteURLParams>()

    const navigate = useNavigate()


    /**
     * On component first render, load contract expectation
     * of client address.
     */
    useState(() => {

        const clientAddressId = params.clientAddressId

        // if no clientAddressId was found
        if (!clientAddressId) {
            navigate(AppRoutes.clientAddresses)
            return
        }


        clientAddressesAPI
            .getClientAddress(clientAddressId)
            .then((clientAddressFromAPI) => {

                // what we get from API
                setClientAddress(clientAddressFromAPI)

                // contract expectation exists? in the sense,
                // is the detail not null?
                if(clientAddressFromAPI.contractExpectation.detail) {

                    // what we're going to send to API
                    setUpdatedContractExpectation({
                        ...updatedContractExpectation,
                        // we initialize the expectations to be updated,
                        // as the expectations that we got from API
                        expectations: clientAddressFromAPI.contractExpectation.detail.expectations
                    })

                } else {
                    setUpdatedContractExpectation({
                        ...updatedContractExpectation,
                        expectations: ""
                    })
                }


            })
            .catch((err: Error) => {

                if(err instanceof BadRequestError) {

                    // appEventDispatcher.dispatchStandard(
                    //     AppEvent.APP_ERROR,
                    //     AppEventMessageType.BAD_REQUEST
                    // )

                }

            })

    //@ts-ignore
    }, [])

    return (
        <Container fluid>
            <Row className="d-flex justify-content-center">
                <Col>

                    {/* page title */}
                    <Row className={"mb-3"}>
                        <Col>
                            <h1 className="text-center">Aspettative di Contratto</h1>
                            <h3 className={"text-center"}>Cliente: {clientAddress.clientName}, Cantiere: {clientAddress.addressName}</h3>
                        </Col>
                    </Row>

                    {/* fields */}
                    <Row>
                        <Col>

                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        // handleAddShift(shiftToAPI)({ setIsError, setIsLoading, setFormValues, setShiftToAPI, setChecklistsFromAPI });
                                    }
                                }}>

                                {/* the contract expectation was success */}
                                {clientAddress.contractExpectation.success && (

                                    <Row className={"d-flex justify-content-center"}>

                                        <Col className={"col-lg-6"}>
                                            <div className="mb-3">
                                                <label htmlFor="comments" className="form-label">Aspettative di Contratto</label>
                                                <textarea
                                                    className="form-control"
                                                    id="comments"
                                                    rows={15}
                                                    placeholder="Inserisci i tuoi comandi per l'AI"
                                                    value={clientAddress.contractExpectation.detail?.expectations}
                                                />
                                            </div>
                                        </Col>

                                    </Row>

                                )}

                                {/* contract expectation was everything but success */}
                                {!clientAddress.contractExpectation.success && (
                                    <p>L'estrazione delle aspettative dal contratto o non esiste, è in lavorazione o non è andata a buon fine.</p>
                                )}


                                {/* submit */}
                                <Row className={"mt-5"}>
                                    <Col className="text-center">
                                        <Button
                                            // disabled={isLoading}
                                            variant="primary"
                                            onClick={() => {
                                                // handleAddShift(shiftToAPI)({ setIsError, setIsLoading, setFormValues, setShiftToAPI, setChecklistsFromAPI });
                                            }}
                                        >
                                            Modifica
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                        </Col>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}