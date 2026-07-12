import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUsers();
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
        fetchUsers(); // نرجع نجيب اللستة المحدثة
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while updating role.");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-panel-container">
      <Link to="/dashboard" className="back-link">&larr; Back to dashboard</Link>
      <h2>Admin Panel - Users</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

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
    </div>
  );
}

export default AdminPanel;