import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Ticket, Headphones, CheckCircle2, Pencil, Trash2, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import "./AdminPanel.css";

const ROLE_DESCRIPTIONS = {
  1: { name: "Admin", desc: "Full system access" },
  4: { name: "Manager", desc: "Department oversight" },
  2: { name: "IT Support Agent", desc: "Ticket resolution tools" },
  3: { name: "Employee", desc: "End-user basic access" },
};

function AdminPanel() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (currentUser?.role_id !== 1) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role_id: "3" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const handlePrint = () => {
    window.print();
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost/InternShip/backend/get_users.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setUsers(data.users);
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
      if (data.success) setLogs(data.logs);
    } catch (err) {
      console.error("Failed to load activity logs");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost/InternShip/backend/get_categories.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("http://localhost/InternShip/backend/get_admin_stats.php", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setAdminStats(data);
      else setAdminStats({ error: true });
    } catch (err) {
      setAdminStats({ error: true });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
    fetchCategories();
    fetchAdminStats();
  }, []);

  const handleRoleChange = async (userId, newRoleId) => {
    setError(""); setSuccess("");
    try {
      const response = await fetch("http://localhost/InternShip/backend/update_user_role.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, role_id: newRoleId }),
      });
      const data = await response.json();
      if (data.success) { setSuccess("Role updated!"); fetchUsers(); }
      else setError(data.message);
    } catch (err) {
      setError("Something went wrong while updating role.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const response = await fetch("http://localhost/InternShip/backend/add_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("User added!");
        setNewUser({ name: "", email: "", password: "", role_id: "3" });
        setShowAddUser(false);
        fetchUsers();
        fetchAdminStats();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while adding user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
    setError(""); setSuccess("");
    try {
      const response = await fetch("http://localhost/InternShip/backend/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (data.success) { setSuccess("User deleted."); fetchUsers(); fetchAdminStats(); }
      else setError(data.message);
    } catch (err) {
      setError("Something went wrong while deleting user.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setError(""); setSuccess("");
    try {
      const response = await fetch("http://localhost/InternShip/backend/manage_categories.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "add", name: newCategory }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Category added!");
        setNewCategory("");
        setShowAddCategory(false);
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while adding category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;
    setError(""); setSuccess("");
    try {
      const response = await fetch("http://localhost/InternShip/backend/manage_categories.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await response.json();
      if (data.success) { setSuccess("Category deleted."); fetchCategories(); }
      else setError(data.message);
    } catch (err) {
      setError("Something went wrong while deleting category.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40 }}>Loading admin panel...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="ap-page">
        <div className="ap-widgets">
          <div className="ap-widget">
            <div className="ap-widget-top"><span>TOTAL USERS</span><div className="ap-widget-icon blue"><Users size={16} /></div></div>
            <span className="ap-widget-number">{adminStats?.total_users ?? "—"}</span>
          </div>
          <div className="ap-widget">
            <div className="ap-widget-top"><span>OPEN TICKETS</span><div className="ap-widget-icon orange"><Ticket size={16} /></div></div>
            <span className="ap-widget-number">{adminStats?.open_tickets ?? "—"}</span>
          </div>
          <div className="ap-widget">
            <div className="ap-widget-top"><span>SUPPORT AGENTS</span><div className="ap-widget-icon purple"><Headphones size={16} /></div></div>
            <span className="ap-widget-number">{adminStats?.support_agents ?? "—"}</span>
          </div>
          <div className="ap-widget">
            <div className="ap-widget-top"><span>SYSTEM STATUS</span><div className="ap-widget-icon green"><CheckCircle2 size={16} /></div></div>
            <span className="ap-widget-status">{adminStats?.error ? "Issue Detected" : "Operational"}</span>
          </div>
        </div>

        {error && <p className="ap-error">{error}</p>}
        {success && <p className="ap-success">{success}</p>}

        <div className="ap-row">
          <div className="ap-panel ap-users-panel">
            <div className="ap-panel-header">
              <h3>User Management</h3>
              <div className="ap-users-controls">
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ap-filter-input"
                />
                <button className="ap-add-btn" onClick={() => setShowAddUser(!showAddUser)}>
                  <Plus size={14} /> Add User
                </button>
              </div>
            </div>

            {showAddUser && (
              <form className="ap-add-form" onSubmit={handleAddUser}>
                <input placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                <select value={newUser.role_id} onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}>
                  <option value="3">Employee</option>
                  <option value="2">IT Support Agent</option>
                  <option value="4">Manager</option>
                  <option value="1">Admin</option>
                </select>
                <button type="submit" className="ap-save-btn">Create</button>
              </form>
            )}

            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select value={u.role_id} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                        <option value="1">Admin</option>
                        <option value="2">IT Support Agent</option>
                        <option value="3">Employee</option>
                        <option value="4">Manager</option>
                      </select>
                    </td>
                    <td><span className="ap-status-dot"></span>Active</td>
                    <td>
                      <div className="ap-row-actions">
                        <button onClick={() => handleDeleteUser(u.id)} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: 16 }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
            <p className="ap-count">Showing {filteredUsers.length} of {users.length} users</p>
          </div>

          <div className="ap-panel ap-logs-panel">
            <div className="ap-panel-header">
              <h3>Activity Logs</h3>
            </div>
            <div className="ap-logs-list">
              {logs.length === 0 && <p className="ap-muted">No activity yet.</p>}
              {logs.slice(0, 6).map((log) => (
                <div className="ap-log-row" key={log.id}>
                  <p className="ap-log-action">{log.user_name} — {log.action}</p>
                  <span className="ap-log-time">{new Date(log.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ap-row ap-row-three">
          <div className="ap-panel">
            <h3>Role Management</h3>
            <div className="ap-roles-list">
              {Object.values(ROLE_DESCRIPTIONS).map((r) => (
                <div className="ap-role-card" key={r.name}>
                  <p className="ap-role-name">{r.name}</p>
                  <p className="ap-role-desc">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ap-panel">
            <div className="ap-panel-header">
              <h3>Ticket Categories</h3>
              <button className="ap-add-btn" onClick={() => setShowAddCategory(!showAddCategory)}>
                <Plus size={14} /> Add Category
              </button>
            </div>

            {showAddCategory && (
              <form className="ap-add-form" onSubmit={handleAddCategory}>
                <input placeholder="Category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
                <button type="submit" className="ap-save-btn">Add</button>
              </form>
            )}

            <div className="ap-categories-grid">
              {categories.map((c) => (
                <div className="ap-category-pill" key={c.id}>
                  {c.name}
                  <button onClick={() => handleDeleteCategory(c.id)}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="ap-panel">
            <h3>Reports Generation</h3>
            <p className="ap-muted" style={{ marginBottom: 14 }}>Generate comprehensive data visualizations for stakeholders.</p>
            <button className="ap-report-btn" onClick={handlePrint}>Generate Monthly Report</button>
            <div className="ap-report-formats">
              <button onClick={handlePrint}>PDF</button>
              <button onClick={handlePrint}>Excel</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="ap-footer">
        <div className="lp-footer-left">
          <span className="lp-footer-brand">IT<span className="lp-footer-brand-accent">HelpDesk</span></span>
          <span className="lp-footer-copy">© 2026 HelpDesk. All rights reserved.</span>
        </div>
        <div className="lp-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </>
  );
}

export default AdminPanel;