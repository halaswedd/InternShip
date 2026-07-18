import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ticket, ClipboardCheck, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const CATEGORY_COLORS = {
  Hardware: "#2563eb",
  Software: "#334155",
  Network: "#991b1b",
  Others: "#93c5fd",
};

const PRIORITY_COLORS = {
  Critical: "#dc2626",
  High: "#7f1d1d",
  Medium: "#2563eb",
  Low: "#94a3b8",
};

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost/InternShip/backend/get_dashboard_stats.php", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40 }}>Loading dashboard...</p>
      </>
    );
  }

  const byCategory = stats?.by_category || {};
  const groupedCategory = {
    Hardware: byCategory["Hardware"] || 0,
    Software: byCategory["Software"] || 0,
    Network: byCategory["Network"] || 0,
    Others: (byCategory["Email"] || 0) + (byCategory["Access Request"] || 0) + (byCategory["Other"] || 0),
  };
  const categoryTotal = Object.values(groupedCategory).reduce((a, b) => a + b, 0) || 1;

  let cumulative = 0;
  const gradientParts = Object.entries(groupedCategory).map(([label, count]) => {
    const pct = (count / categoryTotal) * 100;
    const start = cumulative;
    cumulative += pct;
    return `${CATEGORY_COLORS[label]} ${start}% ${cumulative}%`;
  });
  const donutStyle = { background: `conic-gradient(${gradientParts.join(", ")})` };

  const byPriority = stats?.by_priority || {};
  const maxPriority = Math.max(...Object.values(byPriority), 1);
  const priorityOrder = ["Critical", "High", "Medium", "Low"];

  const openCount = stats?.by_status?.["Open"] || 0;

  return (
    <>
      <Navbar />
      <div className="db-page">
        <div className="db-header">
          <div>
            <h2>Welcome back, {user?.name}</h2>
            <p>You have {openCount} tickets requiring immediate attention today.</p>
          </div>
          <Link to="/create-ticket" className="db-create-btn">+ Create Ticket</Link>
        </div>

        <div className="db-widgets">
          <div className="db-widget">
            <div className="db-widget-icon blue"><Ticket size={18} /></div>
            <span className="db-widget-number">{stats?.by_status?.["Open"] || 0}</span>
            <span className="db-widget-label">Open Tickets</span>
          </div>
          <div className="db-widget">
            <div className="db-widget-icon gray"><ClipboardCheck size={18} /></div>
            <span className="db-widget-number">{stats?.by_status?.["Pending"] || 0}</span>
            <span className="db-widget-label">Pending</span>
          </div>
          <div className="db-widget">
            <div className="db-widget-icon green"><CheckCircle2 size={18} /></div>
            <span className="db-widget-number">{stats?.by_status?.["Resolved"] || 0}</span>
            <span className="db-widget-label">Resolved</span>
          </div>
        </div>

        <div className="db-charts-row">
          <div className="db-panel">
            <h3>Tickets by Category</h3>
            <div className="db-donut-row">
              <div className="db-donut" style={donutStyle}>
                <div className="db-donut-hole">
                  <span className="db-donut-total">{categoryTotal}</span>
                  <span className="db-donut-label">TOTAL</span>
                </div>
              </div>
              <div className="db-legend">
                {Object.entries(groupedCategory).map(([label, count]) => (
                  <div className="db-legend-row" key={label}>
                    <span className="db-legend-dot" style={{ background: CATEGORY_COLORS[label] }}></span>
                    <span className="db-legend-label">{label}</span>
                    <span className="db-legend-pct">{Math.round((count / categoryTotal) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="db-panel">
            <h3>Tickets by Priority</h3>
            <div className="db-priority-bars">
              {priorityOrder.map((label) => {
                const count = byPriority[label] || 0;
                return (
                  <div className="db-priority-row" key={label}>
                    <div className="db-priority-top">
                      <span>{label}</span>
                      <span style={{ color: PRIORITY_COLORS[label] }}>{count}</span>
                    </div>
                    <div className="db-priority-track">
                      <div
                        className="db-priority-fill"
                        style={{ width: `${(count / maxPriority) * 100}%`, background: PRIORITY_COLORS[label] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="db-panel">
          <div className="db-panel-header">
            <h3>Recent Tickets</h3>
            <Link to="/tickets" className="db-view-all">View All</Link>
          </div>
          <table className="db-recent-table">
            <thead>
              <tr>
                <th>TICKET ID</th>
                <th>TITLE</th>
                <th>STATUS</th>
                <th>PRIORITY</th>
                <th>AGENT</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recent_tickets || []).map((t) => (
                <tr key={t.id}>
                  <td><Link to={`/tickets/${t.id}`} className="db-ref">{t.reference_no}</Link></td>
                  <td>{t.title}</td>
                  <td>
                    <span className={`db-status-badge status-${t.status.toLowerCase().replace(" ", "-")}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <span className="db-priority-dot" style={{ color: PRIORITY_COLORS[t.priority] }}>
                      • {t.priority}
                    </span>
                  </td>
                  <td>{t.agent_name || "Unassigned"}</td>
                </tr>
              ))}
              {(!stats?.recent_tickets || stats.recent_tickets.length === 0) && (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No tickets yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="db-footer">
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

export default Dashboard;