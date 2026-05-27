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


export function Example2ReportCard() {


    return (
        <Card>
            <Card.Body>
                <Card.Title>Discrepanze lavoro aspettato / effettivo per operatore</Card.Title>
                <p className="text-muted small">
                    Confronta i turni assegnati ad ogni operatore con quelli effettivamente completati.
                    Identifica chi lavora meno del previsto e agisci prima che diventi un problema.
                </p>
                <p>...</p>
            </Card.Body>
        </Card>
    )
}