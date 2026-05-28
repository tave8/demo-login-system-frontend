import {Col, Container, Row, Table} from "react-bootstrap";
import {ShiftsCountByOperatorReportCard} from "./reports/ShiftsCountByOperatorReportCard.tsx";
import {Example1ReportCard} from "./reports/Example1ReportCard.tsx";
import {Example2ReportCard} from "./reports/Example2ReportCard.tsx";
import {Example3ReportCard} from "./reports/Example3ReportCard.tsx";

export default function AutomationsPage() {
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center">
                <Col>

                    {/* page title */}
                    <Row className={"mb-3"}>
                        <Col>
                            <h1 className="text-center">Automazioni</h1>
                        </Col>
                    </Row>

                    {/* automations */}
                    <Row>
                        <Col>

                            <p className="text-muted">
                                Le Automazioni riducono gli errori dovuti al dimenticarsi e alla gestione manuale.
                            </p>

                            <hr />

                            <h6>Sei notificato automaticamente in questo modo:</h6>

                            <Table bordered hover size="sm" className="mt-3">
                                <thead className="table-light">
                                <tr>
                                    <th>Situazione</th>
                                    <th>Soluzione</th>
                                    <th>Come</th>
                                    <th>Quando</th>
                                    <th>Inviato a</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Discrepanza tra contratto e dati inseriti</td>
                                    <td>Report con le differenze</td>
                                    <td>Email</td>
                                    <td>Ogni lunedì mattina</td>
                                    <td>Tu</td>
                                </tr>
                                <tr>
                                    <td>Sapere il turno del giorno dopo</td>
                                    <td>Viene notificato</td>
                                    <td>Notifica</td>
                                    <td>Ogni mattina del giorno prima</td>
                                    <td>Operatore</td>
                                </tr>
                                <tr>
                                    <td>Quali sono gli operatori con turni mancanti del giorno dopo</td>
                                    <td>Ricevi un avviso</td>
                                    <td>Notifica</td>
                                    <td>Ogni mattina del giorno prima</td>
                                    <td>Tu</td>
                                </tr>
                                </tbody>
                            </Table>


                        </Col>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}