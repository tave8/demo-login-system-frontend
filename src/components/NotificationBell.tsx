import { useState, useEffect, useRef } from "react";
import {EnrichedNotificationFromAPI, NotificationFromAPI} from "../js/my_types.ts";
import NotificationsAPI from "../js/api/NotificationsAPI.ts";
import {ArrowClockwise} from "react-bootstrap-icons";


const notificationsAPI = new NotificationsAPI()

interface LoadMyNotificationsWithParams {
    setNotifications: (x: EnrichedNotificationFromAPI[]) => void
    setIsNotificationListLoading: (x:boolean) => void
    setIsNotificationListError: (x:boolean) => void
}

interface HandleMarkAsReadParams {
    setNotifications: (x: EnrichedNotificationFromAPI[]) => void
    notifications: EnrichedNotificationFromAPI[]
}



export default function NotificationBell() {

    const [open, setOpen] = useState(false);

    // is notifications loading
    const [isNotificationListLoading, setIsNotificationListLoading] = useState(false)
    const [isNotificationListError, setIsNotificationListError] = useState(false)


    const [notifications, setNotifications] = useState<EnrichedNotificationFromAPI[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    const loadMyNotifications = loadMyNotificationsWith({ setNotifications,
                                                                            setIsNotificationListError,
                                                                            setIsNotificationListLoading })

    /**
     * On component first rendering, load
     * user's notifications.
     */
    useEffect(() => {

        // load notifications at this component's first render
        loadMyNotifications()

        // every x time, get my notifications (polling technique)

        setInterval(() => {

            loadMyNotifications()

        //     every minute
        }, 60000)

    }, [])


    const markAsRead = handleMarkAsRead({notifications, setNotifications})


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
                        <button className="btn btn-light btn-sm" onClick={loadMyNotifications}>
                            <ArrowClockwise size={20} />
                        </button>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: "auto" }}>

                        {/* notifications list */}
                        {!isNotificationListLoading && !isNotificationListError && notifications.map((n) => (
                            <div
                                key={n.notificationId}
                                className={`px-3 py-2 border-bottom d-flex justify-content-between align-items-start ${n.readAt === null ? "bg-primary bg-opacity-10" : ""}`}
                            >
                                <div>
                                    <small className="text-muted text-uppercase">{n.type}</small>
                                    <p className="mb-1 fw-semibold">{n.title}</p>
                                    <p className="mb-0 text-muted small">{n.body}</p>
                                </div>

                                {n.readAt === null && (
                                    <button
                                        className="btn btn-link btn-sm p-0 ms-2 text-nowrap"
                                        onClick={() => markAsRead(n.notificationId)}
                                    >
                                        Mark read
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* loading */}
                        {isNotificationListLoading && (
                            <div className="text-center py-4">
                                <div className="spinner-border spinner-border-sm text-secondary" />
                            </div>
                        )}

                        {/* error */}
                        {isNotificationListError && (
                            <div className="alert alert-danger m-3 py-2 mb-0">
                                Something went wrong.
                            </div>
                        )}

                        {/* no notifications */}
                        {!isNotificationListLoading && !isNotificationListError && notifications.length === 0 && (
                            <p className="text-center text-muted py-4 mb-0">No notifications</p>
                        )}


                    </div>
                </div>
            )}

        </div>
    );
}


const loadMyNotificationsWith = (params: LoadMyNotificationsWithParams) => {
    return async () => {

        const {setNotifications, setIsNotificationListLoading, setIsNotificationListError} = params

        setIsNotificationListLoading(true)
        setIsNotificationListError(false)

        notificationsAPI
            .getMyUnreadNotificationsEnriched()
            .then(notificationsPage => {

                setIsNotificationListLoading(false)
                setIsNotificationListError(false)

                // when the component first renders, load all notifications
                setNotifications(notificationsPage.content)

                // console.log(notificationsPage)
                //

            })
            .catch(err => {
                setIsNotificationListLoading(false)
                setIsNotificationListError(true)
            })

    }
}


/**
 * Mark a notification as read.
 */
const handleMarkAsRead =  (params: HandleMarkAsReadParams) => {
    return async (notificationId: string) => {

        const {notifications, setNotifications} = params

        /**
         * Mark a notification as read.
         */

        // console.log("trying to mark as read: ", notificationId)

        const notificationsAPI = new NotificationsAPI()

        notificationsAPI
            .markNotificationAsReadEnriched(notificationId)
            .then(updatedNotification => {

                // console.log(updatedNotification)

                const notificationsWithoutThis = notifications.filter(n => n.notificationId != notificationId)

                // remove this notification from the list
                // @ts-ignore
                setNotifications(notificationsWithoutThis);

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

