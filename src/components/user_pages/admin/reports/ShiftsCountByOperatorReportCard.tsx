import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {FileEarmarkSpreadsheet} from "react-bootstrap-icons";
import {useState} from "react";
import ReportsAPI from "../../../../js/api/ReportsAPI.ts";
import {AppEvent, AppEventMessageType, ShiftsCountByOperatorReportParamsToAPI} from "../../../../js/my_types.ts";
import AppEventDispatcher from "../../../../js/AppEventDispatcher.ts";
import FileHelper from "../../../../js/helpers/FileHelper.ts";
import TimeHelper from "../../../../js/helpers/TimeHelper.ts";

const reportsAPI = ReportsAPI.getInstance()
const appEventDispatcher = AppEventDispatcher.getInstance()

const initialParamsToAPI : ShiftsCountByOperatorReportParamsToAPI = {
    startDate: TimeHelper.startOfWeek(),
    endDate: TimeHelper.endOfWeek()
}


export function ShiftsCountByOperatorReportCard() {

    // we send this to API, it's what the API requires to generate report
    const [paramsToAPI, setParamsToAPI] = useState<ShiftsCountByOperatorReportParamsToAPI>(initialParamsToAPI)

    /**
     * When user clicks on download report.
     */
    const handleDownloadCsv = () => {

        reportsAPI
            .generateShiftsCountByOperator(paramsToAPI)
            .then(blob => {

                FileHelper.downloadCsv(blob, "report_turni")

            })
            .catch((err: Error) => {
                appEventDispatcher.dispatchStandard(
                    AppEvent.APP_ERROR,
                    AppEventMessageType.FILE_DOWNLOAD_ERROR
                )
            })

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
                                    value={paramsToAPI.startDate}
                                    onChange={(e) => {
                                        setParamsToAPI({
                                            ...paramsToAPI,
                                            startDate: e.target.value
                                        })
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Data fine</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={paramsToAPI.endDate}
                                    onChange={(e) => {
                                        setParamsToAPI({
                                            ...paramsToAPI,
                                            endDate: e.target.value
                                        })
                                    }}
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