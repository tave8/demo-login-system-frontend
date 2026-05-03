import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function ErrorToast() {
    const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail ?? "An error occurred";
            setMessages((prev) => [...prev, { id: Date.now(), text: detail }]);
        };

        window.addEventListener("app-error", handler);
        return () => window.removeEventListener("app-error", handler);
    }, []);

    const dismiss = (id: number) =>
        setMessages((prev) => prev.filter((m) => m.id !== id));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {messages.map((m) => (
                <Toast key={m.id} onClose={() => dismiss(m.id)} delay={10000} autohide style={{ borderLeft: "3px solid #dc3545" }}>
                    <Toast.Header>
                        <strong className="me-auto text-danger" style={{ fontSize: "13px" }}>Error</strong>
                    </Toast.Header>
                    <Toast.Body className="text-muted" style={{ fontSize: "13px", padding: "6px 12px" }}>
                        {m.text}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}