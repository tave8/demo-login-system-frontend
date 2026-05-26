import {useEffect, useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {AppEvent} from "../js/my_types.ts";

type ToastType = "app-error" | "app-success" | "invalid-fields";

interface ToastMessage {
    id: string;
    text: string;
    toastType: ToastType;
}

const config: Record<ToastType, { label: string; color: string }> = {
    "app-error":   { label: "Error",   color: "#dc3545" },
    "app-success": { label: "Success", color: "#198754" },
    "invalid-fields": { label: "Error",   color: "#dc3545" },
};

export default function AppToast() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);
    const [eventType, setEventType] = useState<AppEvent|null>(null)

    // depending on the event type, we set a different delay for the toast
    const delay = eventType == AppEvent.INVALID_FIELDS ? 60000 : 20000
    // console.log(delay, eventType)

    useEffect(() => {

        //
        const handler = (toastType: ToastType,
                                                            actualEventType: AppEvent) =>
        {


            return (e: Event) => {
                // whenever a custom event is fired, because we've stored
                // the event type, we can customize the toast based
                // on the event type (closure)
                setEventType(actualEventType)

                const detail = (e as CustomEvent).detail ?? "";
                setMessages((prev) => {

                    // generate random ID

                    return [
                        {
                            id: crypto.randomUUID(),
                            text: detail,
                            toastType
                        },
                        ...prev]
                });

            }

        }

        // bind toast types to app event handlers
        const errorHandler = handler("app-error", AppEvent.APP_ERROR);
        const successHandler = handler("app-success", AppEvent.APP_SUCCESS);
        const invalidFieldsHandler = handler("invalid-fields", AppEvent.INVALID_FIELDS);
        // add more toast types & handlers here...

        // bind app events to toast type handlers
        window.addEventListener(AppEvent.APP_ERROR, errorHandler);
        window.addEventListener(AppEvent.APP_SUCCESS, successHandler);
        window.addEventListener(AppEvent.INVALID_FIELDS, invalidFieldsHandler);
        // add more app events & handlers here...


        return () => {
            window.removeEventListener(AppEvent.APP_ERROR, errorHandler);
            window.removeEventListener(AppEvent.APP_SUCCESS, successHandler);
            window.removeEventListener(AppEvent.INVALID_FIELDS, invalidFieldsHandler);
        };
    }, []);

    const dismiss = (id: string) =>
        setMessages((prev) => prev.filter((m) => m.id !== id));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {messages.map((m) => (
                <Toast
                    key={m.id}
                    onClose={() => dismiss(m.id)}
                    delay={delay}
                    autohide
                    style={{ borderLeft: `3px solid ${config[m.toastType].color}` }}
                >
                    <Toast.Header>
                        <strong className="me-auto" style={{ fontSize: "13px", color: config[m.toastType].color }}>
                            {config[m.toastType].label}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className="text-muted" style={{ fontSize: "13px", padding: "6px 12px" }}>
                        {m.text}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}