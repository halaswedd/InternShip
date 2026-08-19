import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://affectionate-freedom-production-e166.up.railway.app/get_notifications.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unread = notifications.filter(
    (n) => n.is_read == 0
  ).length;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="icon-btn"
        style={{
          position: "relative",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Bell size={26} strokeWidth={2.2} />

        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "#fff",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              fontSize: "11px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: 0,

            // Responsive width
            width: "min(320px, calc(100vw - 32px))",
            maxWidth: "calc(100vw - 32px)",

            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,.15)",
            zIndex: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "15px",
              fontWeight: "bold",
              borderBottom: "1px solid #eee",
            }}
          >
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div
              style={{
                padding: 15,
                fontSize: "13px",
              }}
            >
              No notifications
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                onClick={async () => {
                  const token = localStorage.getItem("token");

                  try {
                    await fetch(
                      "https://affectionate-freedom-production-e166.up.railway.app/mark_notification_read.php",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          notification_id: notification.id,
                        }),
                      }
                    );

                    loadNotifications();

                    if (notification.ticket_id) {
                      navigate(
                        `/tickets/${notification.ticket_id}`
                      );
                    }
                  } catch (error) {
                    console.error(
                      "Error marking notification as read:",
                      error
                    );
                  }
                }}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background:
                    notification.is_read == 0
                      ? "#eef6ff"
                      : "#fff",

                  // Prevent long text from breaking layout
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <div
                  style={{
                    fontWeight:
                      notification.is_read == 0
                        ? "bold"
                        : "normal",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {notification.message}
                </div>

                <small
                  style={{
                    color: "#888",
                    fontSize: "11px",
                    display: "block",
                    marginTop: "5px",
                  }}
                >
                  {notification.created_at}
                </small>
              </div>
            ))
          )}

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              textAlign: "center",
              padding: "15px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            View All
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;