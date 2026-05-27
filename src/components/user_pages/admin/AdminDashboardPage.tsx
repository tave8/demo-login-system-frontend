import {Alert, Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import {AppRoutes, DayOfWeek, OperatorShiftConflictsFromAPI, UserFromAPI} from "../../../js/my_types.ts";
import ShiftsAPI from "../../../js/api/ShiftsAPI.ts";
import TimeHelper from "../../../js/helpers/TimeHelper.ts";
import {Link} from "react-router-dom";
import AddClientPage from "./AddClientPage.tsx";

const clientsAPI = ClientsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()
const usersAPI = UsersAPI.getInstance()
const shiftsAPI = ShiftsAPI.getInstance()



interface OperatorStat {
    operator: UserFromAPI
    stat: Record<DayOfWeek, boolean>
}


const startOfWeek = TimeHelper.startOfWeek()
const endOfWeek = TimeHelper.endOfWeek()
const daysOfWeek = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
]

export default function AdminDashboardPage() {
    // ****************************
    // OPERATORS
    // ****************************

    const [operators, setOperators] = useState<UserFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const [operatorStats, setOperatorStats] = useState<OperatorStat[]>([])

    // ****************************
    // LOAD OPERATORS WHEN THIS ROUTE IS TRIGGERED
    // ****************************

    useEffect(() => {

        setOperators([])


        usersAPI
            .findOperators()
            .then(operatorsFromAPI => {

                setOperators(operatorsFromAPI)

            })
            .catch(err => {

                console.error(err)
            })

    }, []);


    useEffect(() => {

        setOperatorStats([])

        const promises = operators.map(operator =>
            shiftsAPI
                .findConflictsByOperatorBetweenDates(
                    operator.userId,
                    startOfWeek,
                    endOfWeek,
                    daysOfWeek
                )
                .then(conflictsInfo => ({ operator, conflictsInfo }))
        )

        setIsLoading(true)
        setIsError(false)

        Promise
            .all(promises)
            .then((results) => {

                setIsLoading(false)
                setIsError(false)

                const stats = results.map(({ operator, conflictsInfo }) =>
                    getOperatorStat(operator, conflictsInfo)
                )
                setOperatorStats(stats)
            })
            .catch(err => {
                setIsLoading(false)
                setIsError(true)
                console.error(err)
            })

    }, [operators])

    /**
     * Turn conflicts info into an operator stat by weekday.
     */
    const getOperatorStat = (operator: UserFromAPI,
                                                                conflictsInfo: OperatorShiftConflictsFromAPI): OperatorStat =>
    {

        const stat = {
            MONDAY: false,
            TUESDAY: false,
            WEDNESDAY: false,
            THURSDAY: false,
            FRIDAY: false,
            SATURDAY: false,
            SUNDAY: false
        }

        conflictsInfo.shifts.forEach(conflictingShift => {
            // the days of the conflicting shifts are marked as conflicting
            conflictingShift.days.forEach(conflictingDay => {
                // the conflicting day is marked as conflicting
                stat[conflictingDay.day] = true
            })
        })

        return {
            operator,
            stat
        }

    }


    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Turni della settimana</h1>
                            </Col>
                        </Row>

                        {/* table    */}

                        {!isLoading && operatorStats.length > 0 && (
                            <Row>
                                <Col>

                                    <Table striped bordered hover responsive>
                                        <thead>
                                        <tr>
                                            <th>Operatore</th>
                                            <th>LUN</th>
                                            <th>MAR</th>
                                            <th>MER</th>
                                            <th>GIO</th>
                                            <th>VEN</th>
                                            <th>SAB</th>
                                            <th>DOM</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {operatorStats.map(operatorStat => (
                                            // make this key unique
                                            <tr key={operatorStat.operator.userId}>
                                                <td>{operatorStat.operator.firstname} {operatorStat.operator.lastname}</td>
                                                <td>{operatorStat.stat.MONDAY ? "✅" : "❌"}</td>
                                                <td>{operatorStat.stat.TUESDAY ? "✅" : "❌"}</td>
                                                <td>{operatorStat.stat.WEDNESDAY ? "✅" : "❌"}</td>
                                                <td>{operatorStat.stat.THURSDAY ? "✅" : "❌"}</td>
                                                <td>{operatorStat.stat.FRIDAY ? "✅" : "❌"}</td>
                                                <td>{operatorStat.stat.SATURDAY ? "✅" : "❌"}</td>
                                                <td>{operatorStat.stat.SUNDAY ? "✅" : "❌"}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Col>

                            </Row>
                        )}

                        {!isLoading && operatorStats.length == 0 && (
                            <Row>
                                <Col className={"text-center"}>
                                    <p>Nessun turno</p>
                                    <p><Link to={AppRoutes.addClient}>Aggiungi cliente</Link></p>
                                    <p><Link to={AppRoutes.addClientAddress}>Aggiungi cantiere</Link></p>
                                    <p><Link to={AppRoutes.addShift}>Aggiungi turno</Link></p>
                                </Col>
                            </Row>
                        )}

                    </Col>
                </Row>
            </Container>
        </>
    )
}