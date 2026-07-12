import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
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

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="admin-panel-container">
      <Link to="/dashboard" className="back-link">&larr; Back to dashboard</Link>
      <h2>Admin Panel - Users</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
                <span className={`role-badge role-${u.role.toLowerCase().replace(" ", "-")}`}>
                  {u.role}
                </span>
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