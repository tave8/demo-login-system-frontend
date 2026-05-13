import AppEventDispatcher from "../../../js/AppEventDispatcher.ts";
import {useState} from "react";
import {Alert, Button, Col, Container, Form, ListGroup, Modal, Row, Spinner} from "react-bootstrap";
import {
    AppEvent,
    AppEventMessageType, ChecklistFromAPI, ClientAddressFromAPI,
    NewUserFromAPI,
    NewUserToAPI, TaskFromAPI,
    TaskToAPI,
    UserRole
} from "../../../js/my_types.ts";
import UserRoleHelper from "../../../js/helpers/UserRoleHelper.ts";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import UnauthorizedError from "../../../js/exceptions/UnauthorizedError.ts";
import StringHelper from "../../../js/helpers/StringHelper.ts";
import TasksAPI from "../../../js/api/TasksAPI.ts";
import ClientAddressChecklistsAPI from "../../../js/api/ClientAddressChecklistsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import TimeHelper from "../../../js/helpers/TimeHelper.ts";


const appEventDispatcher: AppEventDispatcher = AppEventDispatcher.getInstance()
const clientAddressChecklistsAPI = ClientAddressChecklistsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()



let LAST_AUTOCOMPLETE_TIMEOUT = {
    clientAddresses: 0,
    checklists: 0
}

interface ClientAddressChecklistData {
    clientAddressId: string
    checklistId: string
}

interface FormValues {
    clientAddressName: string
    checklistName: string
}

interface HandleAddChecklistToClientAddressParams {
    setIsLoading: (x:boolean) => void
    setIsError: (x:boolean) => void
    setFormValues: (data: FormValues) => void,
}

interface HandleSearchClientAddressesParams {
    setClientAddressesFromAPI: (clientAddresses: ClientAddressFromAPI[]) => void
    setIsClientAddressesFromAPILoading: (x:boolean) => void
    setIsClientAddressesFromAPIError: (x:boolean) => void
}

const initialFormValues: FormValues = {
    clientAddressName: "",
    checklistName: ""
}

export default function AddChecklistToClientAddressPage () {
    // form (what the user types)
    const [formValues, setFormValues] = useState(initialFormValues)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // client addresses (the user searches client addresses)
    const [clientAddressesFromAPI, setClientAddressesFromAPI] = useState<ClientAddressFromAPI[]>([])
    const [isClientAddressesFromAPILoading, setIsClientAddressesFromAPILoading] = useState(false)
    const [isClientAddressesFromAPIError, setIsClientAddressesFromAPIError] = useState(false)

    // checklists (the user searches checklists)
    const [checklistsFromAPI, setChecklistsFromAPI] = useState<ChecklistFromAPI[]>([])
    const [isChecklistsFromAPILoading, setIsChecklistsFromAPILoading] = useState(false)
    const [isChecklistsFromAPIError, setIsChecklistsFromAPIError] = useState(false)


    // what we need to send to the server
    const [dataToAPI, setDataToAPI] = useState<ClientAddressChecklistData>({
        clientAddressId: "",
        checklistId: ""
    })
    const [isDataToAPILoading, setIsDataToAPILoading] = useState(false)
    const [isDataToAPIError, setIsDataToAPIError] = useState(false)


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9} lg={6}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Aggiungi Scheda Attività a Sede Cliente</h1>
                                {/*<Alert variant="primary" className={"mt-4"}>*/}
                                {/*    Crea l'attività una sola volta e riutilizzala in qualsiasi Scheda Attività.*/}
                                {/*    Le attività sono i singoli compiti che gli operatori devono svolgere nel loro turno.*/}
                                {/*</Alert>*/}
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
                                        // handleAddTask(formValues)({ setIsError, setIsLoading, setFormValues, setTasksJustAdded, tasksJustAdded })
                                    }
                                }}>

                                {/* search client address */}
                                <Col style={{ position: "relative" }}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>Sede cliente</Form.Label>
                                        <div className="text-muted small mb-2">
                                            Cerca per cliente o sede
                                        </div>
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

                                                        // the API only wants to know the client address ID,
                                                        // not the client ID nor the address ID, so be aware of
                                                        // the distinction: the client address ID is the association
                                                        // of a client an address, and is its own separate entity
                                                        setDataToAPI({
                                                            ...dataToAPI,
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


                                {/* submit */}
                                <Col className="text-center">
                                    <Button
                                        disabled={isLoading}
                                        variant="primary"
                                        onClick={() => {
                                            // handleAddTask(formValues)({ setIsError, setIsLoading, setFormValues, tasksJustAdded, setTasksJustAdded })
                                        }}
                                    >
                                        Aggiungi
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
//
// const handleAddTask = (formValues: TaskToAPI) => {
//     return async (params: HandleAddTaskParams) => {
//
//         const { setIsError, setIsLoading, setFormValues, setTasksJustAdded, tasksJustAdded } = params
//
//         console.log(formValues)
//
//         setIsLoading(true)
//         setIsError(false)
//
//         tasksAPI
//             .addTask(formValues)
//             .then((taskFromAPI) => {
//
//                 setIsLoading(false)
//                 setIsError(false)
//
//                 appEventDispatcher.dispatchStandard(
//                     AppEvent.APP_SUCCESS,
//                     AppEventMessageType.SAVE_SUCCESS
//                 )
//
//                 //  reset form values
//                 setFormValues({
//                     name: ""
//                 })
//
//                 // update the tasks just added
//                 setTasksJustAdded([
//                     taskFromAPI,
//                     ...tasksJustAdded
//                 ])
//
//             })
//             .catch((err) => {
//
//                 setIsLoading(false)
//                 setIsError(true)
//
//
//                 appEventDispatcher.dispatchStandard(
//                     AppEvent.APP_ERROR,
//                     AppEventMessageType.SAVE_ERROR
//                 )
//
//
//             })
//
//     }
//
// }





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