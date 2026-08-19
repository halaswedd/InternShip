import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost/InternShip/backend/get_notifications.php", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      await fetch("http://localhost/InternShip/backend/mark_notification_read.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notification_id: notificationId }),
      });
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
    <>
      <Navbar />
      <div className="nt-page">
        <h2>Notifications</h2>

        {loading ? (
          <p className="nt-muted">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="nt-muted">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`nt-item ${notification.ticket_id ? "clickable" : ""}`}
            >
              <h4 className={notification.is_read == 0 ? "unread" : ""}>
                {notification.message}
              </h4>
              <p className="nt-time">{new Date(notification.created_at).toLocaleString()}</p>
              {notification.is_read == 0 && <span className="nt-new-badge">New</span>}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Notifications;