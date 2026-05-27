import {Button, Card, Col, Container, Row} from "react-bootstrap";
import AddShiftForm from "../add_shift/AddShiftForm.tsx";
import {ShiftsCountByOperatorReportCard} from "./ShiftsCountByOperatorReportCard.tsx";

export default function ReportsPage() {
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center">
                <Col>

                    {/* page title */}
                    <Row className={"mb-3"}>
                        <Col>
                            <h1 className="text-center">Report</h1>
                        </Col>
                    </Row>

                    {/* report cards */}
                    <Row className={"row-cols-1 row-cols-sm-2 row-cols-md-3"}>
                        {/* report: shifts count by operator */}
                        <Col>
                            <ShiftsCountByOperatorReportCard />
                        </Col>
                        {/* add new report here...   */}
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}