import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./AdminPanel.css";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost/InternShip/backend/get_users.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost/InternShip/backend/get_activity_logs.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while loading activity logs.");
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const handleRoleChange = async (userId, newRoleId) => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost/InternShip/backend/update_user_role.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, role_id: newRoleId }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Role updated!");
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while updating role.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-panel-container">
        <h2>Admin Panel</h2>

        <div className="admin-tabs">
          <button
            className={activeTab === "users" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "logs" ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab("logs")}
          >
            Activity Logs
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        {activeTab === "users" && (
          <>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role_id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="1">Admin</option>
                          <option value="2">IT Support Agent</option>
                          <option value="3">Employee</option>
                          <option value="4">Manager</option>
                        </select>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === "logs" && (
          <>
            {logsLoading ? (
              <p>Loading activity logs...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="3">No activity yet.</td>
                    </tr>
                  )}
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user_name}</td>
                      <td>{log.action}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AdminPanel;