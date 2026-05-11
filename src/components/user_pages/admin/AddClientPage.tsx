import {useState} from "react";
import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {
    AppEvent,
    AppEventMessageType, AppRoutes,
    ClientToAPI,
    EnrichedGeocodingAutocompleteItemFromAPI
} from "../../../js/my_types.ts";
import GeocodingAPI from "../../../js/api/GeocodingAPI.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import StringHelper from "../../../js/helpers/StringHelper.ts";
import BadRequestError from "../../../js/exceptions/BadRequestError.ts";
import {Link} from "react-router-dom";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const geocodingAPI = GeocodingAPI.getInstance()
const clientsAPI = ClientsAPI.getInstance()


interface HandleAddClientParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (user: ClientToAPI) => void
}

interface HandleAutocompleteAddress {
    setIsAutocompleteLoading: (x:boolean) => void
    setIsAutocompleteError: (x:boolean) => void,
    setAutocompleteAddressess: (addresses: EnrichedGeocodingAutocompleteItemFromAPI[]) => void
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

let LAST_AUTOCOMPLETE_TIMEOUT: number|undefined = undefined


export default function AddClientPage () {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // this is for legal address autocomplete
    const [autocompleteAddressess, setAutocompleteAddressess] = useState<EnrichedGeocodingAutocompleteItemFromAPI[]>([])
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false)
    const [isAutocompleteError, setIsAutocompleteError] = useState(false)


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={6} lg={4}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi Cliente</h1>
                                {/*<p className={"text-center mt-3"}><Link to={AppRoutes.addClientAddress}>Già aggiunto il cliente e vuoi aggiungere una sede?</Link></p>*/}

                            </Col>
                        </Row>

                        <Row>
                            {/* form */}
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                }}
                                onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddClient(formValues)({ setIsError, setIsLoading, setFormValues });
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
                                <Col style={{ position: "relative" }}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Indirizzo sede legale</Form.Label>
                                        <Form.Text className="text-muted d-block mb-2">
                                            Nota: Questo è l'indirizzo della sede legale.
                                            Potrai aggiungere le sedi operative / cantieri del cliente nella pagina "Aggiungi sede",
                                            solo dopo aver aggiunto il cliente qui.
                                        </Form.Text>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Inserisci almeno 5 caratteri..."
                                            value={formValues.legalAddress}
                                            onChange={(event) => {
                                                const query = event.target.value

                                                setFormValues({
                                                    ...formValues,
                                                    legalAddress: query,
                                                })

                                                // autocomplete is triggered when user has typed
                                                // at least 5 chars
                                                if(query.length >= 5) {

                                                    // mechanism for delaying autocomplete on typing
                                                    clearTimeout(LAST_AUTOCOMPLETE_TIMEOUT)

                                                    LAST_AUTOCOMPLETE_TIMEOUT = setTimeout(() => {
                                                        handleAutocompleteAddress(query)({setAutocompleteAddressess,
                                                                                            setIsAutocompleteError,
                                                                                            setIsAutocompleteLoading})
                                                    }, 1000)

                                                }


                                            }}
                                        />
                                    </Form.Group>

                                    {!isAutocompleteLoading && (
                                        <ListGroup style={{ maxHeight: "250px", overflowY: "auto", position: "absolute" }}>
                                            {autocompleteAddressess.map((address, index) => (
                                                <ListGroup.Item
                                                    key={index}
                                                    action
                                                    onMouseDown={(e) => {
                                                        e.preventDefault()
                                                        setFormValues({
                                                            ...formValues,
                                                            legalAddress: address.displayName,
                                                            legalAddressLat: address.lat,
                                                            legalAddressLon: address.lon,
                                                        })
                                                        setAutocompleteAddressess([])
                                                    }}
                                                >
                                                    {address.displayName} <br/> <small><i>(certezza: {address.confidenceFormatted})</i></small>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}

                                    {/* is loading */}
                                    {isAutocompleteLoading && (
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    )}

                                    {/* is error */}
                                    {isAutocompleteError && <Alert variant="danger">Something went wrong.</Alert>}

                                    
                                    
                                </Col>


                                {/* submit */}
                                <Col className="text-center">
                                    <Button
                                        disabled={isLoading}
                                        variant="primary"
                                        onClick={() => {
                                            handleAddClient(formValues)({ setIsError, setIsLoading, setFormValues });
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

        const { setIsError, setIsLoading, setFormValues } = params

        requireValidFields(formValues)

        setIsLoading(true)
        setIsError(false)

        clientsAPI
            .addClient(formValues)
            .then((clientFromAPI) => {

                setIsLoading(false)
                setIsError(false)

                // reset form fields
                setFormValues({
                    email: "",
                    vat: "",
                    legalAddressLat: 0,
                    legalAddressLon: 0,
                    legalName: "",
                    legalAddress: "",
                    phone: ""
                })


                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_SUCCESS,
                    AppEventMessageType.SAVE_SUCCESS
                )

            })
            .catch((err) => {

                setIsLoading(false)
                setIsError(true)

                if (err instanceof BadRequestError) {

                    appEventDispatcher.dispatchStandard(
                        AppEvent.APP_ERROR,
                        AppEventMessageType.BAD_REQUEST
                    )

                }
            })
    }

}



const handleAutocompleteAddress = (query: string) =>
{
    return async (params: HandleAutocompleteAddress) => {

        const {setIsAutocompleteLoading, setIsAutocompleteError, setAutocompleteAddressess} = params

        setIsAutocompleteLoading(true)
        setIsAutocompleteError(false)

        geocodingAPI
            .autocompleteInLocalLanguageEnriched(query)
            .then((result) => {

                setIsAutocompleteLoading(false)
                setIsAutocompleteError(false)

                setAutocompleteAddressess(result.results)

            })
            .catch(err => {

                setIsAutocompleteLoading(false)
                setIsAutocompleteError(true)


            })

    }

}

/**
 * Require that all fields are valid.
 * If not, an error is thrown and a toast message
 * for to the user is shown.
 */
const requireValidFields = (formValues: ClientToAPI) => {

    const isValidEmail = StringHelper.isValidEmail(formValues.email)
    const isNonEmptyLegalAddress = formValues.legalAddress.trim() != ""
    const isNonEmptyVat = formValues.vat.trim() != ""
    const isNonEmptyLegalName = formValues.legalName.trim() != ""
    const isNonEmptyPhone = formValues.phone.trim() != ""

    const errors: string[] = []

    if (!isValidEmail) {
        errors.push("L'email deve essere valida")
    }
    if (!isNonEmptyLegalAddress) {
        errors.push("L'indirizzo sede legale non può essere vuoto")
    }
    if (!isNonEmptyVat) {
        errors.push("La partita IVA non può essere vuota")
    }
    if (!isNonEmptyLegalName) {
        errors.push("La ragione sociale non può essere vuota")
    }
    if (!isNonEmptyPhone) {
        errors.push("Il telefono non può essere vuoto")
    }

    // if there are errors
    if(errors.length > 0) {

        appEventDispatcher.dispatchStandard(
            AppEvent.INVALID_FIELDS,
            AppEventMessageType.INVALID_FIELDS,
            errors.join(", ")
        )

        throw new Error("At least one field is invalid")
    }


}