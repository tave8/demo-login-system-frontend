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


export function Example1ReportCard() {


    return (
        <Card>
            <Card.Body>
                <Card.Title>Discrepanze di contratto per cantiere</Card.Title>
                <p className="text-muted small">
                    L'Intelligenza Artificiale confronta quello che è scritto nel contratto
                    con quello che hai inserito in ZeroChiamate e genera un report con le differenze.
                    Meno clienti insoddisfatti, più tempo per crescere.
                </p>
                <p>...</p>
                <p></p>
            </Card.Body>
        </Card>
    )
}