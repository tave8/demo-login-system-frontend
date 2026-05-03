import { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function SignupToast() {
    const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail ?? "Account created successfully";
            setMessages((prev) => [...prev, { id: Date.now(), text: detail }]);
        };

        window.addEventListener("signup-success", handler);
        return () => window.removeEventListener("signup-success", handler);
    }, []);

    const dismiss = (id: number) =>
        setMessages((prev) => prev.filter((m) => m.id !== id));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {messages.map((m) => (
                <Toast key={m.id} onClose={() => dismiss(m.id)}>
                    <Toast.Header>
                        <span style={{ color: "#198754", marginRight: "8px", fontSize: "16px" }}>✓</span>
                        <strong className="me-auto" style={{ fontSize: "16px" }}>Account created</strong>
                    </Toast.Header>
                    <Toast.Body className="text-muted" style={{ fontSize: "15px" }}>
                        {m.text}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}