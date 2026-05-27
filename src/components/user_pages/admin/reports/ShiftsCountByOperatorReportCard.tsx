import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {FileEarmarkSpreadsheet} from "react-bootstrap-icons";
import {useState} from "react";

export function ShiftsCountByOperatorReportCard() {

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleDownloadCsv = () => {

    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Numero turni per operatore</Card.Title>

                <Form>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Data inizio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Data fine</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleDownloadCsv}>
                        <FileEarmarkSpreadsheet className="me-2" />
                        Scarica CSV
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}