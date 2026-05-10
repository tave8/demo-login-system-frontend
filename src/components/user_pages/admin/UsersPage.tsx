import {Button, Col, Container, Row, Table} from "react-bootstrap";
import UsersAPI from "../../../js/api/UsersAPI.ts";
import {useEffect, useState} from "react";

const usersAPI = UsersAPI.getInstance()


export default function UsersPage() {

    const [users, setUsers] = useState([])

    // get the users
    useEffect(() => {

        // console.log("sdsds")
        // usersAPI.getMyUsers()

    }, [])

    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={9}>

                        {/* title */}
                        <Row className={"mb-3"}>
                            <Col>
                                <h1 className="text-center">Il mio Team</h1>
                            </Col>
                        </Row>

                        {/* table    */}
                        <Row>
                            <Col>

                                <Table striped bordered hover responsive>
                                    <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Ruolo</th>
                                        <th>Azioni</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*{users.map(user => (*/}
                                    {/*    <tr key={user.id}>*/}
                                    {/*        <td>{user.firstname} {user.lastname}</td>*/}
                                    {/*        <td>{user.role}</td>*/}
                                    {/*        <td>*/}
                                    {/*            <Button variant="outline-primary" size="sm">Modifica</Button>*/}
                                    {/*            {' '}*/}
                                    {/*            <Button variant="outline-danger" size="sm">Elimina</Button>*/}
                                    {/*        </td>*/}
                                    {/*    </tr>*/}
                                    {/*))}*/}
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