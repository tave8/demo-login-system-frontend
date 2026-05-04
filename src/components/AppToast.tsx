import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import {AppEvent} from "../js/my_types.ts";

type ToastType = "app-error" | "app-success";

interface ToastMessage {
    id: number;
    text: string;
    toastType: ToastType;
}

const config: Record<ToastType, { label: string; color: string }> = {
    "app-error":   { label: "Error",   color: "#dc3545" },
    "app-success": { label: "Success", color: "#198754" },
};

export default function AppToast() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const handler = (toastType: ToastType) => (e: Event) => {
            const detail = (e as CustomEvent).detail ?? "";
            setMessages((prev) => [{ id: Date.now(), text: detail, toastType }, ...prev]);
        };

        // bind toast types to app event handlers
        const errorHandler = handler("app-error");
        const successHandler = handler("app-success");
        // add more toast types & handlers here...

        // bind app events to toast type handlers
        window.addEventListener(AppEvent.APP_ERROR, errorHandler);
        window.addEventListener(AppEvent.APP_SUCCESS, successHandler);
        // add more app events & handlers here...


        return () => {
            window.removeEventListener(AppEvent.APP_ERROR, errorHandler);
            window.removeEventListener(AppEvent.APP_SUCCESS, successHandler);
        };
    }, []);

    const dismiss = (id: number) =>
        setMessages((prev) => prev.filter((m) => m.id !== id));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {messages.map((m) => (
                <Toast
                    key={m.id}
                    onClose={() => dismiss(m.id)}
                    delay={10000}
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