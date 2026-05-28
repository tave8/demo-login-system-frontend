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


export function Example3ReportCard() {


    return (
        <Card>
            <Card.Body>
                <Card.Title>Cantieri non coperti</Card.Title>
                <p className="text-muted small">
                    Cantieri che non hanno turni assegnati nel periodo selezionato.
                    Un cantiere senza copertura è un cliente che sta pagando senza ricevere il servizio.
                </p>
                <p>...</p>
            </Card.Body>
        </Card>
    )
}