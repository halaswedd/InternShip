import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import "./TicketDetails.css";

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function TicketDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [ticket, setTicket] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      const response = await fetch(
        `http://localhost/InternShip/backend/get_ticket.php?id=${id}`,
        { method: "GET", headers: { "Authorization": `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        const t = data.ticket;
        setTicket(t);
        setCategoryId(t.category_id);
        setPriorityId(t.priority_id);
        setStatusId(t.status_id);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while loading the ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateTicket = async (fields) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost/InternShip/backend/update_ticket.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: id,
          title: ticket.title,
          description: ticket.description,
          category_id: fields.category_id ?? categoryId,
          priority_id: fields.priority_id ?? priorityId,
          status_id: fields.status_id ?? statusId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Updated!");
        fetchTicket();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while updating.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40 }}>Loading ticket...</p>
      </>
    );
  }

  if (error && !ticket) {
    return (
      <>
        <Navbar />
        <p style={{ padding: 40, color: "red" }}>{error}</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="td-page">
        <div className="td-top-actions">
          <button className="td-close-btn" onClick={() => updateTicket({ status_id: "5" })}>
            <X size={15} /> Close
          </button>
          <button className="td-resolve-btn" onClick={() => updateTicket({ status_id: "4" })}>
            <CheckCircle2 size={15} /> Resolve Ticket
          </button>
        </div>

        <div className="td-card td-header-card">
          <div className="td-header-left">
            <div className="td-tags">
              <span className="td-ref-tag">{ticket.reference_no}</span>
              <span className={`td-status-badge status-${ticket.status.toLowerCase().replace(" ", "-")}`}>
                • {ticket.status}
              </span>
              <span className="td-priority-badge">! {ticket.priority}</span>
            </div>
            <h2>{ticket.title}</h2>
            <p className="td-meta">
              Reported {new Date(ticket.created_at).toLocaleString()} by {ticket.requested_by || "Unknown"}
            </p>
          </div>
          <div className="td-avatar" title={ticket.requested_by}>
            {initials(ticket.requested_by)}
          </div>
        </div>

        <div className="td-card td-requester-properties">
          <h4>REQUESTER</h4>
          <div className="td-requester">
            <div className="td-avatar small">{initials(ticket.requested_by)}</div>
            <div>
              <p className="td-requester-name">{ticket.requested_by || "Unknown"}</p>
              <p className="td-requester-email">{ticket.requester_email || ""}</p>
            </div>
          </div>

          <div className="td-divider"></div>

          <h4>PROPERTIES</h4>
          <label>Status</label>
          <select
            value={statusId}
            onChange={(e) => { setStatusId(e.target.value); updateTicket({ status_id: e.target.value }); }}
          >
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="3">Pending</option>
            <option value="4">Resolved</option>
            <option value="5">Closed</option>
          </select>

          <label>Priority</label>
          <select
            value={priorityId}
            onChange={(e) => { setPriorityId(e.target.value); updateTicket({ priority_id: e.target.value }); }}
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>

          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); updateTicket({ category_id: e.target.value }); }}
          >
            <option value="1">Hardware</option>
            <option value="2">Software</option>
            <option value="3">Network</option>
            <option value="4">Email</option>
            <option value="5">Access Request</option>
            <option value="6">Other</option>
          </select>
        </div>

        <div className="td-card td-description-card">
          <h4>DESCRIPTION</h4>
          <p className="td-description">{ticket.description || "No description provided."}</p>
        </div>

        <div className="td-card td-description-card">
          <div className="td-attachments-header">
            <h4>ATTACHMENTS</h4>
            <span className="td-download-all">Download All</span>
          </div>
          <div className="td-attachments-grid">
            <div className="td-attachment-placeholder">
              <span>📎</span>
              <p>No attachments yet</p>
            </div>
          </div>
        </div>

        {error && <p className="td-error">{error}</p>}
        {success && <p className="td-success">{success}</p>}
      </div>

      <footer className="td-footer">
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

export default TicketDetails;