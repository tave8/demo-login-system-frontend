import { useState, useEffect, useRef } from "react";
import {NotificationFromAPI} from "../js/my_types.ts";
import NotificationsAPI from "../js/api/NotificationsAPI.ts";




export default function NotificationBell() {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationFromAPI[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    /**
     * On component first rendering, load
     * user's notifications.
     */
    useEffect(() => {

        const notificationsAPI = new NotificationsAPI()

        notificationsAPI
            .getMyNotifications()
            .then(notificationsPage => {



            })
            .catch(err => {

            })

    }, [])

    /*
    * On click outside notification dropdown,
    * hide notification dropdown.
    * */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const unreadCount = notifications.filter((n) => n.readAt === null).length;

    // const markAsRead = (id: number) => {
    //     fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    //     setNotifications((prev) =>
    //         prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    //     );
    // };
    //
    // const markAllAsRead = () => {
    //     fetch("/api/notifications/read-all", { method: "PATCH" });
    //     setNotifications((prev) =>
    //         prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    //     );
    // };

    return (
        <div ref={ref} className="position-relative d-inline-block">
            <button className="btn btn-light position-relative" onClick={() => setOpen((o) => !o)}>
                🔔
                {unreadCount > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {unreadCount}
                      </span>
                )}
            </button>

            {open && (
                <div className="dropdown-menu show shadow" style={{ width: 320, right: 0, left: "auto" }}>
                    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                        <strong>Notifications</strong>
                        {/*{unreadCount > 0 && (*/}
                        {/*    <button className="btn btn-link btn-sm p-0" onClick={markAllAsRead}>*/}
                        {/*        Mark all as read*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </div>

                    <div style={{ maxHeight: 400, overflowY: "auto" }}>

                        {/* there are notifications */}
                        {notifications.length > 0 && (
                            notifications.map((n) => (
                                <div
                                    key={n.notificationId}
                                    className={`px-3 py-2 border-bottom ${n.readAt === null ? "bg-primary bg-opacity-10" : ""}`}
                                    style={{ cursor: n.readAt === null ? "pointer" : "default" }}
                                    // onClick={() => n.readAt === null && markAsRead(n.id)}
                                >
                                    <small className="text-muted text-uppercase">{n.type}</small>
                                    <p className="mb-1 fw-semibold">{n.title}</p>
                                    <p className="mb-0 text-muted small">{n.body}</p>
                                </div>
                            ))
                        )}


                        {/* no notifications */}
                        {notifications.length == 0 && (
                            <p className="text-center text-muted py-4 mb-0">No notifications</p>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}