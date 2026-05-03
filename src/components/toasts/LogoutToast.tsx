import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function LogoutToast() {
    const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail ?? "Successfully logged out";
            setMessages((prev) => [...prev, { id: Date.now(), text: detail }]);
        };

        window.addEventListener("logout-success", handler);
        return () => window.removeEventListener("logout-success", handler);
    }, []);

    const dismiss = (id: number) =>
        setMessages((prev) => prev.filter((m) => m.id !== id));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {messages.map((m) => (
                <Toast key={m.id} onClose={() => dismiss(m.id)} delay={3000} autohide>
                    <Toast.Body className="d-flex align-items-center gap-2 text-muted">
                        <span>✓</span>
                        <span>{m.text}</span>
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}