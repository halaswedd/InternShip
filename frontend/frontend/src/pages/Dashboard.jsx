import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost/InternShip/backend/get_dashboard_stats.php", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderBars = (data) => {
    if (!data) return null;
    const max = Math.max(...Object.values(data), 1);
    return Object.entries(data).map(([label, count]) => (
      <div className="bar-row" key={label}>
        <span className="bar-label">{label}</span>
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{ width: `${(count / max) * 100}%` }}
          />
        </div>
        <span className="bar-count">{count}</span>
      </div>
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}!</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-links">
        <Link to="/create-ticket">+ Create New Ticket</Link>
        <Link to="/tickets">View All Tickets</Link>
        <Link to="/admin">Admin Panel</Link>
      </div>

      {loading && <p>Loading stats...</p>}

      {stats && (
        <div className="stats-section">
          <div className="widgets-row">
            <div className="widget">
              <span className="widget-number">{stats.by_status["Open"] || 0}</span>
              <span className="widget-label">Open</span>
            </div>
            <div className="widget">
              <span className="widget-number">{stats.by_status["In Progress"] || 0}</span>
              <span className="widget-label">In Progress</span>
            </div>
            <div className="widget">
              <span className="widget-number">{stats.by_status["Resolved"] || 0}</span>
              <span className="widget-label">Resolved</span>
            </div>
            <div className="widget">
              <span className="widget-number">{stats.by_status["Pending"] || 0}</span>
              <span className="widget-label">Pending</span>
            </div>
          </div>

          <h3>Tickets by Category</h3>
          <div className="bar-chart">{renderBars(stats.by_category)}</div>

          <h3>Tickets by Status</h3>
          <div className="bar-chart">{renderBars(stats.by_status)}</div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;