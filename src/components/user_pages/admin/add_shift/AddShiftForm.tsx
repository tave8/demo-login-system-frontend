import {Alert, Button, Col, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {
    AppEvent, AppEventMessageType,
    ChecklistFromAPI,
    ClientAddressFromAPI,
    DAY_LABELS,
    DayOfWeek,
    Language,
    ShiftToAPI
} from "../../../../js/my_types.ts";
import {useNavigate} from "react-router-dom";
import AppEventDispatcher from "../../../../js/AppEventDispatcher.ts";
import ClientAddressChecklistsAPI from "../../../../js/api/ClientAddressChecklistsAPI.ts";
import ClientAddressesAPI from "../../../../js/api/ClientAddressesAPI.ts";
import ChecklistsAPI from "../../../../js/api/ChecklistsAPI.ts";
import ShiftsAPI from "../../../../js/api/ShiftsAPI.ts";
import TimeHelper from "../../../../js/helpers/TimeHelper.ts";
import LanguageHelper from "../../../../js/helpers/LanguageHelper.ts";
import BadRequestError from "../../../../js/exceptions/BadRequestError.ts";

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
// FORM VALUES
// ****************************

interface FormValues {
    clientAddressName: string
    checklistName: string
    days: DayOfWeek[],
    operatorIds: [],
    startDate: string
    endDate: string
    startTime: string
    endTime: string
}


// ****************************
// PARAMS: SEARCH CLIENT ADDRESSES & CHECKLISTS
// ****************************

interface HandleSearchClientAddressesParams {
    setClientAddressesFromAPI: (clientAddresses: ClientAddressFromAPI[]) => void
    setIsClientAddressesFromAPILoading: (x:boolean) => void
    setIsClientAddressesFromAPIError: (x:boolean) => void
}


// ****************************
// INITIAL DATA TO SEND TO SERVER
// ****************************

const initialShiftToAPI: ShiftToAPI = {
    clientAddressId: "",
    checklistId: "",
    operatorIds: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    days: []
}

// ****************************
// INITIAL FORM VALUES
// ****************************

const initialFormValues: FormValues = {
    clientAddressName: "",
    checklistName: "",
    days: [],
    operatorIds: [],
    startDate: TimeHelper.today(),
    endDate: "",
    startTime: "06:00",
    endTime: "06:00"
}

// ****************************
// PARAMS: HANDLE ADD SHIFT
// ****************************

interface HandleAddShiftParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (values: FormValues) => void
    setShiftToAPI: (shift: ShiftToAPI) => void
    // after adding a shift, you must reset
    // the checklists that were loaded
    setChecklistsFromAPI: (checklists: ChecklistFromAPI[]) => void
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

    const [shiftToAPI, setShiftToAPI] = useState<ShiftToAPI>(initialShiftToAPI)
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
    // CHECKLISTS BY CHOSEN CLIENT ADDRESS
    // ****************************

    // checklists (the user searches checklists)
    const [checklistsFromAPI, setChecklistsFromAPI] = useState<ChecklistFromAPI[]>([])
    // const [isChecklistsFromAPILoading, setIsChecklistsFromAPILoading] = useState(false)
    // const [isChecklistsFromAPIError, setIsChecklistsFromAPIError] = useState(false)


    // ****************************
    // LOAD CHECKLISTS ON CLIENT ADDRESS CHANGE
    // ****************************

    // when the client address is changed, load the
    // checklists associated to that client address
    useEffect(() => {

        // at first render, do not load
        if(shiftToAPI.clientAddressId != "")
        {
            checklistsAPI
                .findChecklistsByClientAddress(shiftToAPI.clientAddressId)
                .then(checklistsFromAPI => {

                    setChecklistsFromAPI(checklistsFromAPI)

                    // select the first checklist, if it exists
                    if(checklistsFromAPI.length > 0) {
                        setShiftToAPI({
                            ...shiftToAPI,
                            checklistId: checklistsFromAPI[0].id
                        })
                    }
                    // if no checklist exists, reset
                    else {
                        setShiftToAPI({
                            ...shiftToAPI,
                            checklistId: ""
                        })
                    }
                })
                .catch(err => {

                })   
        }

    }, [shiftToAPI.clientAddressId]);

    // ****************************
    // SYNC FORM VALUES WITH DATA FOR SERVER
    // ****************************

    // when something in the form values changes
    // update ONLY the relevant fields that you're going to send
    // to server
    useEffect(() => {

        setShiftToAPI({
            ...shiftToAPI,
            // these 5 values come from the form,
            // and we need to sync them with the object
            // that we're actually going to send to the server,
            // which is shiftToAPI
            days: formValues.days,
            operatorIds: formValues.operatorIds,
            startTime: formValues.startTime,
            endTime: formValues.endTime,
            startDate: formValues.startDate,
            endDate: formValues.endDate
        })

    }, [formValues]);



    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleAddShift(shiftToAPI)({ setIsError, setIsLoading, setFormValues, setShiftToAPI, setChecklistsFromAPI });
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

                                        // update what you send to server
                                        setShiftToAPI({
                                            ...shiftToAPI,
                                            clientAddressId: clientAddress.id
                                        })

                                        // this is what the user sees in the input,
                                        // once they click on a client address
                                        // we show the user more details, but
                                        const clientAddressNameFormatted = `${clientAddress.clientName} - ${clientAddress.addressName} - ${clientAddress.addressDisplayName}`

                                        // update UI
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
                     SEARCH CHECKLISTS
                    *****************
                */}


                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Scheda Attività della Sede</Form.Label>
                        <Form.Select
                            value={shiftToAPI.checklistId}
                            onChange={(e) => {

                                const checklistIdSelected = e.target.value

                                // update the value to send to server
                                setShiftToAPI({
                                    ...shiftToAPI,
                                    checklistId: checklistIdSelected
                                })

                            }}
                        >
                            {/* if there are checklists for the selected client address */}
                            {checklistsFromAPI.length > 0 && checklistsFromAPI.map(checklistFromAPI => (
                                <option
                                    key={checklistFromAPI.id}
                                    value={checklistFromAPI.id}>
                                    {checklistFromAPI.name}
                                </option>
                            ))}

                            {/* if client address is not selected yet
                                or it has no checklists */}
                            {checklistsFromAPI.length == 0 && (
                                <option
                                    key={""}
                                    value={""}
                                    disabled>
                                    (Nessuna Scheda Attività disponibile)
                                </option>
                            )}

                        </Form.Select>
                    </Form.Group>
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
                            type="date"
                            value={formValues.startDate}
                            max={formValues.endDate || undefined}
                            onChange={(e) => setFormValues({ ...formValues, startDate: e.target.value })}
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
                        {/* end date — start date is the lower bound */}
                        <Form.Control
                            type="date"
                            value={formValues.endDate}
                            min={formValues.startDate || undefined}
                            onChange={(e) => setFormValues({ ...formValues, endDate: e.target.value })}
                        />
                    </Form.Group>
                </Col>


            </Row>

                {/*
                    ****************
                     START TIME
                    *****************
                */}


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


                {/*
                    ****************
                     END TIME
                    *****************
                */}


                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Ora fine</Form.Label>
                        <Form.Select
                            style={{ height: "200px" }}
                            htmlSize={8}
                            value={formValues.endTime}
                            onChange={(e) => setFormValues({ ...formValues, endTime: e.target.value })}
                        >
                            {generateTimeOptions(formValues.startTime || "06:00", "22:00").map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/*
                    ****************
                     DAYS
                    *****************
                */}

                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Giorni</Form.Label>
                        {Object.values(DayOfWeek).map(day => (
                            <Form.Check
                                key={day}
                                type="checkbox"
                                label={DAY_LABELS[LanguageHelper.getLanguage()][day]}
                                checked={formValues.days.includes(day)}
                                onChange={(e) => {
                                    const updated = e.target.checked
                                        ? [...formValues.days, day]
                                        : formValues.days.filter(d => d !== day)
                                    setFormValues({ ...formValues, days: updated })
                                }}
                            />
                        ))}
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
                            handleAddShift(shiftToAPI)({ setIsError, setIsLoading, setFormValues, setShiftToAPI, setChecklistsFromAPI });
                        }}
                    >
                        Aggiungi turno
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}




const handleAddShift = (shiftToAPI: ShiftToAPI) => {
    return async (params: HandleAddShiftParams) => {

        const { setIsError, setIsLoading, setFormValues, setShiftToAPI, setChecklistsFromAPI } = params

        // console.log(shiftToAPI)

        requireValidFields(shiftToAPI)

        setIsLoading(true)
        setIsError(false)

        shiftsAPI
            .addShift(shiftToAPI)
            .then((shiftFromAPI) => {

                setIsLoading(false)
                setIsError(false)

                // reset data to send to server
                setShiftToAPI(initialShiftToAPI)

                // reset form fields
                setFormValues(initialFormValues)

                // reset the checklists that were loaded
                // for the selected client address
                setChecklistsFromAPI([])


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



/**
 * Require that all fields are valid.
 * If not, an error is thrown and a toast message
 * for to the user is shown.
 */
const requireValidFields = (shiftToAPI: ShiftToAPI) => {

    const isNonEmptyClientAddress = shiftToAPI.clientAddressId.trim() !== ""
    const isNonEmptyChecklist = shiftToAPI.checklistId.trim() !== ""
    const isNonEmptyStartDate = shiftToAPI.startDate.trim() !== ""
    const isNonEmptyStartTime = shiftToAPI.startTime.trim() !== ""
    const isNonEmptyEndTime = shiftToAPI.endTime.trim() !== ""
    const hasAtLeastOneDay = shiftToAPI.days.length > 0

    const errors: string[] = []

    if (!isNonEmptyClientAddress) {
        errors.push("La sede del cliente non può essere vuota")
    }
    if (!isNonEmptyChecklist) {
        errors.push("La scheda attività non può essere vuota")
    }
    if (!isNonEmptyStartDate) {
        errors.push("La data di inizio non può essere vuota")
    }
    if (!isNonEmptyStartTime) {
        errors.push("L'ora di inizio non può essere vuota")
    }
    if (!isNonEmptyEndTime) {
        errors.push("L'ora di fine non può essere vuota")
    }
    if (!hasAtLeastOneDay) {
        errors.push("Seleziona almeno un giorno della settimana")
    }

    if (errors.length > 0) {
        appEventDispatcher.dispatchStandard(
            AppEvent.INVALID_FIELDS,
            AppEventMessageType.INVALID_FIELDS,
            errors.join(", ")
        )
        throw new Error("At least one field is invalid")
    }
}


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