import {Alert, Button, Col, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import {useState} from "react";
import {ChecklistFromAPI, ClientAddressFromAPI, DayOfWeek, ShiftToAPI} from "../../../../js/my_types.ts";
import {useNavigate} from "react-router-dom";
import AppEventDispatcher from "../../../../js/AppEventDispatcher.ts";
import ClientAddressChecklistsAPI from "../../../../js/api/ClientAddressChecklistsAPI.ts";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import ChecklistsAPI from "../../../../js/api/ChecklistsAPI.ts";
import ShiftsAPI from "../../../../js/api/ShiftsAPI.ts";

const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const clientAddressChecklistsAPI = ClientAddressChecklistsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()
const checklistsAPI = ChecklistsAPI.getInstance()
const shiftsAPI = ShiftsAPI.getInstance()

// ****************************
// DELAY SEARCHING
// ****************************

let LAST_AUTOCOMPLETE_TIMEOUT = {
    clientAddresses: 0,
    checklists: 0
}

// ****************************
// SEND TO SERVER
// ****************************

// interface ShiftData {
//     clientAddressId: string
//     checklistId: string
// }

// ****************************
// FORM VALUES
// ****************************

interface FormValues {
    clientAddressName: string
    checklistName: string
    days: DayOfWeek[]
    startDate: string
    endDate: string
    startTime: string
    endTime: string
}

// ****************************
// PARAMS: HANDLE ADD CHECKLIST TO CLIENT ADDRESS
// ****************************

// interface HandleAddChecklistToClientAddressParams {
//     setIsLoading: (x:boolean) => void
//     setIsError: (x:boolean) => void
//     navigate: NavigateFunction
// }

// ****************************
// PARAMS: SEARCH CLIENT ADDRESSES & CHECKLISTS
// ****************************

interface HandleSearchClientAddressesParams {
    setClientAddressesFromAPI: (clientAddresses: ClientAddressFromAPI[]) => void
    setIsClientAddressesFromAPILoading: (x:boolean) => void
    setIsClientAddressesFromAPIError: (x:boolean) => void
}

// interface HandleSearchChecklistsParams {
//     setChecklistsFromAPI: (checklists: ChecklistFromAPI[]) => void
//     setIsChecklistsFromAPILoading: (x:boolean) => void
//     setIsChecklistsFromAPIError: (x:boolean) => void
// }

// ****************************
// INITIAL FORM VALUES
// ****************************

const initialFormValues: FormValues = {
    clientAddressName: "",
    checklistName: "",
    days: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
}


export default function AddShiftForm() {
    // ****************************
    // FORM VALUES
    // ****************************

    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // ****************************
    // SEND TO SERVER
    // ****************************

    const [shiftToAPI, setShiftToAPI] = useState<ShiftToAPI>({
        clientAddressId: "",
        checklistId: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        days: []
    })
    const [isDataToAPILoading, setIsDataToAPILoading] = useState(false)
    const [isDataToAPIError, setIsDataToAPIError] = useState(false)

    // ****************************
    // SEARCH CLIENT ADDRESSES
    // ****************************

    // client addresses (the user searches client addresses)
    const [clientAddressesFromAPI, setClientAddressesFromAPI] = useState<ClientAddressFromAPI[]>([])
    const [isClientAddressesFromAPILoading, setIsClientAddressesFromAPILoading] = useState(false)
    const [isClientAddressesFromAPIError, setIsClientAddressesFromAPIError] = useState(false)

    // ****************************
    // SEARCH CHECKLISTS
    // ****************************

    // checklists (the user searches checklists)
    // const [checklistsFromAPI, setChecklistsFromAPI] = useState<ChecklistFromAPI[]>([])
    // const [isChecklistsFromAPILoading, setIsChecklistsFromAPILoading] = useState(false)
    // const [isChecklistsFromAPIError, setIsChecklistsFromAPIError] = useState(false)


    const navigate = useNavigate()

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    // handleAddClient(formValues)({ setIsError, setIsLoading, setFormValues });
                }
            }}>

            <Row className={"row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"}>

                {/*
                    ****************
                     SEARCH CLIENT ADDRESSES
                    *****************
                */}


                <Col style={{ position: "relative" }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Sede cliente</Form.Label>
                        <Form.Control
                            disabled={isLoading}
                            type="text"
                            autoComplete="off"
                            value={formValues.clientAddressName}
                            placeholder="Inserisci almeno 3 caratteri..."
                            onChange={(event) => {

                                const query = event.target.value

                                setFormValues({
                                    ...formValues,
                                    clientAddressName: query
                                })

                                // autocomplete is triggered when user has typed
                                // at least 3 chars
                                if(query.length >= 3) {

                                    // mechanism for delaying autocomplete on typing
                                    clearTimeout(LAST_AUTOCOMPLETE_TIMEOUT.clientAddresses)

                                    LAST_AUTOCOMPLETE_TIMEOUT.clientAddresses = setTimeout(() => {

                                        handleSearchClientAddresses(query)({
                                            setIsClientAddressesFromAPILoading,
                                            setIsClientAddressesFromAPIError,
                                            setClientAddressesFromAPI
                                        })

                                    }, 1000)

                                }


                            }}
                        />
                    </Form.Group>

                    {!isClientAddressesFromAPILoading && (
                        <ListGroup style={{ maxHeight: "250px", overflowY: "auto", position: "absolute", zIndex: "9999" }}>
                            {clientAddressesFromAPI.map((clientAddress, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    onMouseDown={(e) => {
                                        e.preventDefault()

                                        setShiftToAPI({
                                            ...shiftToAPI,
                                            clientAddressId: clientAddress.id
                                        })

                                        // this is what the user sees in the input,
                                        // once they click on a client address
                                        // we show the user more details, but
                                        const clientAddressNameFormatted = `${clientAddress.clientName} - ${clientAddress.addressName} - ${clientAddress.addressDisplayName}`

                                        setFormValues({
                                            ...formValues,
                                            clientAddressName: clientAddressNameFormatted
                                        })

                                        // empty the list
                                        setClientAddressesFromAPI([])
                                    }}
                                >
                                    {clientAddress.clientName}
                                    <br/>
                                    <small><i>{clientAddress.addressName}</i></small>
                                    <br />
                                    <small><i>{clientAddress.addressDisplayName}</i></small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    {/* is loading */}
                    {isClientAddressesFromAPILoading && (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )}

                    {/* is error */}
                    {isClientAddressesFromAPIError && <Alert variant="danger">Something went wrong.</Alert>}


                </Col>

                {/*
                    ****************
                     START DATE
                    *****************
                */}

                <Col>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Giorno inizio</Form.Label>
                        <Form.Control
                            disabled={isLoading}
                            type="date"
                            placeholder=""
                            value={formValues.startDate}
                            onChange={(event) => {
                                setFormValues({
                                    ...formValues,
                                    startDate: event.target.value,
                                })
                            }}
                        />
                    </Form.Group>
                </Col>

                {/*
                    ****************
                     END DATE
                    *****************
                */}

                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Giorno fine</Form.Label>
                        <Form.Control
                            disabled={isLoading}
                            type="date"
                            placeholder=""
                            value={formValues.endDate}
                            onChange={(event) => {
                                setFormValues({
                                    ...formValues,
                                    endDate: event.target.value,
                                })
                            }}
                        />
                    </Form.Group>
                </Col>

                <Col>
                    ...
                </Col>

            </Row>

            <Row className={"row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4"}>
                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Ora inizio</Form.Label>
                        <Form.Select
                            style={{ height: "200px" }}
                            htmlSize={8}
                            value={formValues.startTime}
                            onChange={(e) => setFormValues({ ...formValues, startTime: e.target.value })}
                        >
                            {generateTimeOptions("06:00", "22:00").map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Ora fine</Form.Label>
                        <Form.Select
                            style={{ height: "200px" }}
                            htmlSize={8}
                            value={formValues.endTime}
                            onChange={(e) => setFormValues({ ...formValues, endTime: e.target.value })}
                        >
                            {generateTimeOptions(formValues.startTime, "22:00").map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>


            {/* submit */}
            <Row>
                <Col className="text-center">
                    <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={() => {
                            // handleAddClient(formValues)({ setIsError, setIsLoading, setFormValues });
                        }}
                    >
                        Aggiungi turno
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}



//
// const handleAddClient = (formValues: ClientToAPI) => {
//     return async (params: HandleAddClientParams) => {
//
//         const { setIsError, setIsLoading, setFormValues } = params
//
//         requireValidFields(formValues)
//
//         setIsLoading(true)
//         setIsError(false)
//
//         clientsAPI
//             .addClient(formValues)
//             .then((clientFromAPI) => {
//
//                 setIsLoading(false)
//                 setIsError(false)
//
//                 // reset form fields
//                 setFormValues({
//                     email: "",
//                     vat: "",
//                     legalAddressLat: 0,
//                     legalAddressLon: 0,
//                     legalName: "",
//                     legalAddress: "",
//                     phone: ""
//                 })
//
//
//                 appEventDispatcher.dispatchStandard(
//                     AppEvent.APP_SUCCESS,
//                     AppEventMessageType.SAVE_SUCCESS
//                 )
//
//             })
//             .catch((err) => {
//
//                 setIsLoading(false)
//                 setIsError(true)
//
//                 if (err instanceof BadRequestError) {
//
//                     appEventDispatcher.dispatchStandard(
//                         AppEvent.APP_ERROR,
//                         AppEventMessageType.BAD_REQUEST
//                     )
//
//                 }
//             })
//     }
//
// }
//



const handleSearchClientAddresses = (query: string) =>
{
    return async (params: HandleSearchClientAddressesParams) => {

        const {setClientAddressesFromAPI, setIsClientAddressesFromAPILoading, setIsClientAddressesFromAPIError} = params

        setIsClientAddressesFromAPILoading(true)
        setIsClientAddressesFromAPIError(false)

        clientAddressesAPI
            .searchClientAddresses(query)
            .then((result) => {

                setIsClientAddressesFromAPILoading(false)
                setIsClientAddressesFromAPIError(false)

                setClientAddressesFromAPI(result.content)

            })
            .catch(err => {

                setIsClientAddressesFromAPILoading(false)
                setIsClientAddressesFromAPIError(true)


            })

    }

}



//
// const handleAutocompleteAddress = (query: string) =>
// {
//     return async (params: HandleAutocompleteAddress) => {
//
//         const {setIsAutocompleteLoading, setIsAutocompleteError, setAutocompleteAddressess} = params
//
//         setIsAutocompleteLoading(true)
//         setIsAutocompleteError(false)
//
//         geocodingAPI
//             .autocompleteInLocalLanguageEnriched(query)
//             .then((result) => {
//
//                 setIsAutocompleteLoading(false)
//                 setIsAutocompleteError(false)
//
//                 setAutocompleteAddressess(result.results)
//
//             })
//             .catch(err => {
//
//                 setIsAutocompleteLoading(false)
//                 setIsAutocompleteError(true)
//
//
//             })
//
//     }
//
// }
//
// /**
//  * Require that all fields are valid.
//  * If not, an error is thrown and a toast message
//  * for to the user is shown.
//  */
// const requireValidFields = (formValues: ClientToAPI) => {
//
//     const isValidEmail = StringHelper.isValidEmail(formValues.email)
//     const isNonEmptyLegalAddress = formValues.legalAddress.trim() != ""
//     const isNonEmptyVat = formValues.vat.trim() != ""
//     const isNonEmptyLegalName = formValues.legalName.trim() != ""
//     const isNonEmptyPhone = formValues.phone.trim() != ""
//
//     const errors: string[] = []
//
//     if (!isValidEmail) {
//         errors.push("L'email deve essere valida")
//     }
//     if (!isNonEmptyLegalAddress) {
//         errors.push("L'indirizzo sede legale non può essere vuoto")
//     }
//     if (!isNonEmptyVat) {
//         errors.push("La partita IVA non può essere vuota")
//     }
//     if (!isNonEmptyLegalName) {
//         errors.push("La ragione sociale non può essere vuota")
//     }
//     if (!isNonEmptyPhone) {
//         errors.push("Il telefono non può essere vuoto")
//     }
//
//     // if there are errors
//     if(errors.length > 0) {
//
//         appEventDispatcher.dispatchStandard(
//             AppEvent.INVALID_FIELDS,
//             AppEventMessageType.INVALID_FIELDS,
//             errors.join(", ")
//         )
//
//         throw new Error("At least one field is invalid")
//     }
//
//
// }


const generateTimeOptions = (minTime?: string, maxTime?: string) => {
    return Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2).toString().padStart(2, "0")
        const minutes = i % 2 === 0 ? "00" : "30"
        return `${hours}:${minutes}`
    }).filter(time => {
        if (minTime && time < minTime) return false
        if (maxTime && time > maxTime) return false
        return true
    })
}