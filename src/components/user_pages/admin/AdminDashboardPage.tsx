import {Alert, Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";
import ClientsAPI from "../../../js/api/ClientsAPI.ts";
import ClientAddressesAPI from "../../../js/api/ClientAddressesAPI.ts";
import {UserFromAPI} from "../../../js/my_types.ts";

const clientsAPI = ClientsAPI.getInstance()
const clientAddressesAPI = ClientAddressesAPI.getInstance()
const usersAPI = UsersAPI.getInstance()



export default function AdminDashboardPage() {
    const [operators, setOperators] = useState<UserFromAPI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)


    // ****************************
    // LOAD OPERATORS WHEN THIS ROUTE IS TRIGGERED
    // ****************************

    useEffect(() => {

        usersAPI
            .findOperators()
            .then(_operatorsFromAPI => {
                setOperators(_operatorsFromAPI)
            })
            .catch(err => {

            })

    }, []);


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
                                    {operators.map(operator => (
                                        // make this key unique
                                        <tr key={operator.userId}>
                                            <td>{operator.firstname} {operator.lastname}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </Col>

                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    )
}