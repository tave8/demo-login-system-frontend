import {useState} from "react";
import {Alert, Button, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {
    AppEvent,
    AppEventMessageType, AppRoutes, ClientAddressToAPI,
    ClientToAPI, EnrichedClientFromAPI,
    EnrichedGeocodingAutocompleteItemFromAPI
} from "../../../js/my_types.ts";
import GeocodingAPI from "../../../js/api/GeocodingAPI.ts";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import StringHelper from "../../../js/helpers/StringHelper.ts";
import BadRequestError from "../../../js/exceptions/BadRequestError.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import {Link} from "react-router-dom";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const geocodingAPI = GeocodingAPI.getInstance()
const clientsAPI = ClientsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()

interface HandleAddClientAddressParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (user: ClientAddressToAPI) => void
    setClientId: (x: string) => void
    setClientName: (x: string) => void
}

interface HandleAutocompleteAddress {
    setIsAutocompleteLoading: (x:boolean) => void
    setIsAutocompleteError: (x:boolean) => void,
    setAutocompleteAddressess: (addresses: EnrichedGeocodingAutocompleteItemFromAPI[]) => void
}

interface HandleSearchClientParams {
    setIsSearchClientLoading: (x:boolean) => void
    setIsSearchClientError: (x:boolean) => void,
    setClients: (clients: EnrichedClientFromAPI[]) => void
}

const initialFormValues: ClientAddressToAPI = {
    address: "",
    addressName: "",
    addressLon: 0,
    addressLat: 0
}

let LAST_AUTOCOMPLETE_TIMEOUT: number|undefined = undefined


export default function AddClientAddressPage () {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // we keep track of the client id
    const [clientId, setClientId] = useState<string>("")
    const [clientName, setClientName] = useState<string>("")

    // this is for legal address autocomplete
    const [autocompleteAddressess, setAutocompleteAddressess] = useState<EnrichedGeocodingAutocompleteItemFromAPI[]>([])
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false)
    const [isAutocompleteError, setIsAutocompleteError] = useState(false)

    // this is for searching the client
    const [clients, setClients] = useState<EnrichedClientFromAPI[]>([])
    const [isSearchClientLoading, setIsSearchClientLoading] = useState(false)
    const [isSearchClientError, setIsSearchClientError] = useState(false)

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9} lg={6}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi Sede a Cliente</h1>
                                {/*<p className={"text-center mt-3"}><Link to={AppRoutes.addClient}>Aggiungi cliente</Link></p>*/}
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
                                        handleAddClientAddress(clientId, formValues)({ setIsError, setIsLoading, setFormValues, setClientId, setClientName });
                                    }
                                }}>

                                {/* client */}
                                <Col style={{ position: "relative" }}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Cliente</Form.Label>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            autoComplete="off"
                                            value={clientName}
                                            placeholder="Inserisci almeno 3 caratteri..."
                                            onChange={(event) => {

                                                const query = event.target.value

                                                setClientName(query)

                                                // autocomplete is triggered when user has typed
                                                // at least 3 chars
                                                if(query.length >= 3) {

                                                    // mechanism for delaying autocomplete on typing
                                                    clearTimeout(LAST_AUTOCOMPLETE_TIMEOUT)

                                                    LAST_AUTOCOMPLETE_TIMEOUT = setTimeout(() => {

                                                        handleSearchClient(query)({setClients, setIsSearchClientError, setIsSearchClientLoading})

                                                    }, 1000)

                                                }


                                            }}
                                        />
                                    </Form.Group>

                                    {!isSearchClientLoading && (
                                        <ListGroup style={{ maxHeight: "250px", overflowY: "auto", position: "absolute", zIndex: "9999" }}>
                                            {clients.map((client, index) => (
                                                <ListGroup.Item
                                                    key={index}
                                                    action
                                                    onMouseDown={(e) => {
                                                        e.preventDefault()
                                                        setClientId(client.clientId)
                                                        // when the user clicks, we set
                                                        // both the legal name of the client,
                                                        // as well as its legal address
                                                        setClientName(`${client.legalName} (${client.legalAddress})`)
                                                        setClients([])
                                                    }}
                                                >
                                                    {client.legalName}
                                                    <br/>
                                                    <small>Sede legale: <i>{client.legalAddress}</i></small>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}

                                    {/* is loading */}
                                    {isSearchClientLoading && (
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    )}

                                    {/* is error */}
                                    {isSearchClientError && <Alert variant="danger">Something went wrong.</Alert>}


                                </Col>

                                {/* address custom name */}
                                <Col>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Nome sede</Form.Label>
                                        <Form.Text className="text-muted d-block mb-2">
                                            Scegli un nome che ti aiuterà a riconoscere subito la sede di questo cliente.
                                        </Form.Text>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            placeholder="Nome della sede"
                                            value={formValues.addressName}
                                            onChange={(event) => {
                                                setFormValues({
                                                    ...formValues,
                                                    addressName: event.target.value,
                                                })
                                            }}
                                        />
                                    </Form.Group>
                                </Col>


                                {/* client's address */}
                                <Col style={{ position: "relative" }}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Indirizzo sede</Form.Label>
                                        <Form.Text className="text-muted d-block mb-2">
                                            Nota: Questo è l'indirizzo della sede operativa / cantiere del cliente che hai scelto.
                                            Ogni cliente può avere più sedi.
                                        </Form.Text>
                                        <Form.Control
                                            disabled={isLoading}
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Inserisci almeno 5 caratteri..."
                                            value={formValues.address}
                                            onChange={(event) => {
                                                const query = event.target.value

                                                setFormValues({
                                                    ...formValues,
                                                    address: query,
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
                                                            address: address.displayName,
                                                            addressLat: address.lat,
                                                            addressLon: address.lon,
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
                                            handleAddClientAddress(clientId, formValues)({ setIsError, setIsLoading, setFormValues, setClientId, setClientName });
                                        }}
                                    >
                                        Aggiungi sede
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

const handleAddClientAddress = (clientId: string,  formValues: ClientAddressToAPI) => {
    return async (params: HandleAddClientAddressParams) => {

        const { setIsError, setIsLoading, setFormValues, setClientId, setClientName } = params

        requireValidFields(formValues, clientId)


        setIsLoading(true)
        setIsError(false)

        clientAddressesAPI
            .addAddressToClient(clientId, formValues)
            .then((clientAddressFromAPI) => {

                setIsLoading(false)
                setIsError(false)

                // reset form fields
                setClientName("")
                setClientId("")
                setFormValues({
                    address: "",
                    addressName: "",
                    addressLat: 0,
                    addressLon: 0,
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


const handleSearchClient = (query: string) =>
{
    return async (params: HandleSearchClientParams) => {

        const {setIsSearchClientLoading, setIsSearchClientError, setClients} = params

        setIsSearchClientLoading(true)
        setIsSearchClientError(false)

        clientsAPI
            .searchClients(query)
            .then((result) => {

                setIsSearchClientLoading(false)
                setIsSearchClientError(false)

                setClients(result.content)

            })
            .catch(err => {

                setIsSearchClientLoading(false)
                setIsSearchClientError(true)


            })

    }

}


/**
 * Require that all fields are valid.
 * If not, an error is thrown and a toast message
 * for to the user is shown.
 */
const requireValidFields = (formValues: ClientAddressToAPI, clientId: string) => {

    const isNonEmptyClient = clientId.trim() != ""
    const isNonEmptyAddressName = formValues.addressName.trim() != ""
    const isNonEmptyAddress = formValues.address.trim() != ""

    const errors: string[] = []

    if (!isNonEmptyClient) {
        errors.push("Il cliente non può essere vuoto")
    }
    if (!isNonEmptyAddressName) {
        errors.push("Il nome della sede non può essere vuota")
    }
    if (!isNonEmptyAddress) {
        errors.push("L'indirizzo non può essere vuoto")
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