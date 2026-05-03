import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function NetworkErrorToast() {
    const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail ?? "Network error";
            setMessages((prev) => [...prev, { id: Date.now(), text: detail }]);
        };

        window.addEventListener("network-error", handler);
        return () => window.removeEventListener("network-error", handler);
    }, []);

    const dismiss = (id: number) =>
        setMessages((prev) => prev.filter((m) => m.id !== id));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {messages.map((m) => (
                <Toast key={m.id} onClose={() => dismiss(m.id)} delay={5000} autohide bg="danger">
                    <Toast.Header>
                        <strong className="me-auto">Network Error</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{m.text}</Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}