import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Reports.css";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://affectionate-freedom-production-e166.up.railway.app/get_reports_data.php",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (result.success) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40 }}>Loading reports...</p>
      </>
    );
  }

  const monthly = data?.monthly || [];
  const maxCount = Math.max(
    ...monthly.map((m) => m.count),
    1
  );

  const chartWidth = 600;
  const chartHeight = 160;
  const chartPadding = 20;
  const horizontalPadding = 30;

  const getX = (i) =>
    monthly.length > 1
      ? horizontalPadding +
        (i / (monthly.length - 1)) *
          (chartWidth - horizontalPadding * 2)
      : chartWidth / 2;

  const getY = (count) =>
    chartPadding +
    (1 - count / maxCount) *
      (chartHeight - chartPadding * 2);

  const points = monthly
    .map((m, i) => `${getX(i)},${getY(m.count)}`)
    .join(" ");

  return (
    <>
      <Navbar />

      <div className="rp-page">
        <div className="rp-header">
          <div>
            <h2>Reports & Analytics</h2>

            <p>
              Monitor system performance, team efficiency, and
              customer satisfaction metrics.
            </p>
          </div>

          <div className="rp-export-buttons">
            <button
              className="rp-export-btn outline"
              onClick={handlePrintPDF}
            >
              Export PDF
            </button>

            <button
              className="rp-export-btn filled"
              onClick={handlePrintPDF}
            >
              Export Excel
            </button>
          </div>
        </div>

        <div className="rp-widgets">
          <div className="rp-widget">
            <span className="rp-widget-label">
              Total Tickets
            </span>

            <span className="rp-widget-number">
              {data.total_tickets}
            </span>
          </div>

          <div className="rp-widget">
            <span className="rp-widget-label">
              Open Tickets
            </span>

            <span className="rp-widget-number orange">
              {data.open_tickets}
            </span>
          </div>

          <div className="rp-widget">
            <span className="rp-widget-label">
              Resolved Tickets
            </span>

            <span className="rp-widget-number">
              {data.resolved_tickets}
            </span>
          </div>

          <div className="rp-widget">
            <span className="rp-widget-label">
              Avg. Resolution Time
            </span>

            <span className="rp-widget-number">
              {data.avg_resolution_hours} hrs
            </span>
          </div>
        </div>

        <div className="rp-panel rp-chart-panel">
          <h3>Monthly Ticket Reports</h3>

          {monthly.length === 1 && (
            <p
              className="rp-muted"
              style={{ marginBottom: 10 }}
            >
              Showing 1 month of data — trend line will appear as
              more months are added.
            </p>
          )}

          {monthly.length > 0 ? (
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
              className="rp-chart-svg"
            >
              <polyline
                points={points}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />

              {monthly.map((m, i) => {
                const x = getX(i);
                const y = getY(m.count);

                return (
                  <g key={m.label}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="var(--primary)"
                    />

                    <text
                      x={x}
                      y={chartHeight + 20}
                      fontSize="11"
                      fill="var(--text-muted)"
                      textAnchor="middle"
                    >
                      {m.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <p className="rp-muted">
              Not enough data yet.
            </p>
          )}
        </div>

        <div className="rp-row">
          <div className="rp-panel">
            <h3>Top Performers</h3>

            <div className="rp-performers-list">
              {data.top_performers.length === 0 && (
                <p className="rp-muted">
                  No resolved tickets assigned yet.
                </p>
              )}

              {data.top_performers.map((p) => (
                <div
                  className="rp-performer-row"
                  key={p.id}
                >
                  <div className="rp-avatar">
                    {initials(p.name)}
                  </div>

                  <div className="rp-performer-info">
                    <p className="rp-performer-name">
                      {p.name}
                    </p>
                  </div>

                  <span className="rp-performer-count">
                    {p.resolved_count} Tickets
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rp-panel">
            <div className="rp-panel-header">
              <h3>Recent Support Activity</h3>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {data.recent_activity.map((a) => (
                  <tr key={a.reference_no}>
                    <td>{a.reference_no}</td>

                    <td>
                      {a.agent_name || "Unassigned"}
                    </td>

                    <td>
                      <span
                        className={`rp-status-badge status-${a.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        a.updated_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="rp-footer">
        <div className="lp-footer-left">
          <span className="lp-footer-brand">
            IT
            <span className="lp-footer-brand-accent">
              HelpDesk
            </span>
          </span>

          <span className="lp-footer-copy">
            © 2026 HelpDesk. All rights reserved.
          </span>
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

export default Reports;