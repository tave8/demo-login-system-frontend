import {Alert, Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import {DayOfWeek, OperatorShiftConflictsFromAPI, ShiftFromAPI, UserFromAPI} from "../../../js/my_types.ts";
import ShiftsAPI from "../../../js/api/ShiftsAPI.ts";
import TimeHelper from "../../../js/helpers/TimeHelper.ts";

const clientsAPI = ClientsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()
const usersAPI = UsersAPI.getInstance()
const shiftsAPI = ShiftsAPI.getInstance()




export default function OperatorDashboardPage() {
    // ****************************
    // SHIFTS
    // ****************************

    const [shifts, setShifts] = useState<ShiftFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)


    // ****************************
    // LOAD SHIFTS WHEN THIS ROUTE IS TRIGGERED
    // ****************************

    useEffect(() => {

        setShifts([])

        shiftsAPI
            .findMyShiftsToday()
            .then(shiftsFromAPI => {
                setShifts(shiftsFromAPI)
            })
            .catch(err => {
                console.error(err)
            })

    }, []);



    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">I miei turni di oggi</h1>
                            </Col>
                        </Row>

                        {/* my shifts    */}
                        <Row>
                            <Col>

                                <Row className={"row-cols-1 row-cols-md-2 row-cols-lg-3"}>

                                    {shifts.map(shift => (
                                        <Col key={shift.id} className="mb-3">
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>{shift.clientAddress.clientName}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{shift.clientAddress.addressDisplayName}</Card.Subtitle>
                                                    <hr />
                                                    <p className="mb-1">🕐 {shift.startTime} - {shift.endTime}</p>
                                                    <p className="mb-2">📋 {shift.checklist.name}</p>
                                                    <ul className="mb-0">
                                                        {shift.checklist.entries.map((entry, index) => (
                                                            <li key={index}><small>{entry.taskName}</small></li>
                                                        ))}
                                                    </ul>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}

                                    {/* no shifts   */}
                                    {shifts.length == 0 && (
                                        <p>Nessun turno per oggi.</p>
                                    )}

                                </Row>

                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    )
}