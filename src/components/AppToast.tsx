import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastType = "app-error" | "app-success";

interface ToastMessage {
    id: number;
    text: string;
    type: ToastType;
}

const config: Record<ToastType, { label: string; color: string }> = {
    "app-error":   { label: "Error",   color: "#dc3545" },
    "app-success": { label: "Success", color: "#198754" },
};

export default function AppToast() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const handler = (type: ToastType) => (e: Event) => {
            const detail = (e as CustomEvent).detail ?? "";
            setMessages((prev) => [{ id: Date.now(), text: detail, type }, ...prev]);
        };

        const errorHandler = handler("app-error");
        const successHandler = handler("app-success");

        window.addEventListener("app-error", errorHandler);
        window.addEventListener("app-success", successHandler);

        return () => {
            window.removeEventListener("app-error", errorHandler);
            window.removeEventListener("app-success", successHandler);
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
                    style={{ borderLeft: `3px solid ${config[m.type].color}` }}
                >
                    <Toast.Header>
                        <strong className="me-auto" style={{ fontSize: "13px", color: config[m.type].color }}>
                            {config[m.type].label}
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