import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost/InternShip/backend/get_notifications.php",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, is_read: 1 } : n
      )
    );

    try {
      await fetch(
        "http://localhost/InternShip/backend/mark_notification_read.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notification_id: notificationId }),
        }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.is_read == 0) {
      markAsRead(notification.id);
    }
    if (notification.ticket_id) {
      navigate(`/tickets/${notification.ticket_id}`);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <h2>Notifications</h2>

        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p style={{ color: "gray" }}>No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                cursor: notification.ticket_id ? "pointer" : "default",
              }}
            >
              <h4 style={{ margin: 0 }}>{notification.message}</h4>

              <p
                style={{
                  marginTop: "8px",
                  color: "#666",
                  fontSize: "13px",
                }}
              >
                {notification.created_at}
              </p>

              {notification.is_read == 0 && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    background: "#007bff",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  New
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;