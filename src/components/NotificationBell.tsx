import { useState, useEffect, useRef } from "react";
import {EnrichedNotificationFromAPI, NotificationFromAPI} from "../js/my_types.ts";
import NotificationsAPI from "../js/api/NotificationsAPI.ts";




export default function NotificationBell() {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<EnrichedNotificationFromAPI[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    /**
     * On component first rendering, load
     * user's notifications.
     */
    useEffect(() => {

        const notificationsAPI = new NotificationsAPI()

        notificationsAPI
            .getMyUnreadNotificationsEnriched()
            .then(notificationsPage => {

                // when the component first renders, load all notifications
                setNotifications(notificationsPage.content)

                console.log(notificationsPage)

            })
            .catch(err => {

            })

    }, [])


    const markAsRead = handleMarkAsRead()


    /*
    * On click outside notification dropdown,
    * hide notification dropdown.
    * */
    useEffect(() => {
        handleOnClickOutsideDropdown({ref, setOpen})
    }, []);

    const unreadCount = notifications.filter((n) => n.readAt === null).length;


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
                                    onClick={() => {

                                        if(n.readAt == null) {
                                            markAsRead(n.notificationId)
                                        }

                                    }}
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


/**
 * Mark a notification as read.
 */
const handleMarkAsRead =  () => {
    return async (notificationId: string) => {

        /**
         * Mark a notification as read.
         */

        // console.log("trying to mark as read: ", notificationId)

        const notificationsAPI = new NotificationsAPI()

        notificationsAPI
            .markNotificationAsReadEnriched(notificationId)
            .then(updatedNotification => {

                console.log(updatedNotification)

            })
            .catch(err => {
                console.error(err)
            })


    }
}

const handleOnClickOutsideDropdown = ({ref, setOpen}) => {

    const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);

}

