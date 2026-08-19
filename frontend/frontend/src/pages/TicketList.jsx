import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./TicketList.css";
import { Pencil, Trash2 } from "lucide-react";

const PAGE_SIZE = 4;

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name) {
  const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  const index = (name || "").length % colors.length;
  return colors[index];
}

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const response = await fetch(
        "https://affectionate-freedom-production-e166.up.railway.app/get_tickets.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while loading tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        "https://affectionate-freedom-production-e166.up.railway.app/delete_ticket.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticket_id: ticketId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchTickets();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong while deleting.");
    }
  };

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.reference_no
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        t.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.requested_by || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "" || t.status === statusFilter;

      const matchesPriority =
        priorityFilter === "" || t.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "" || t.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    tickets,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) {
    return (
      <p style={{ padding: 40 }}>
        Loading tickets...
      </p>
    );
  }

  return (
    <div className="tl-page">
      <Navbar />

      <div className="tl-content">
        <div className="tl-header">
          <div>
            <h2>Ticket Management</h2>
            <p>
              Manage and monitor internal support requests
            </p>
          </div>

          <Link
            to="/create-ticket"
            className="tl-create-btn"
          >
            + Create New Ticket
          </Link>
        </div>

        <div className="tl-filters">
          <div className="tl-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by ID, Subject or User..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Email">Email</option>
            <option value="Access Request">
              Access Request
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        {error && (
          <p style={{ color: "red", padding: "0 20px" }}>
            {error}
          </p>
        )}

        <div className="tl-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>TICKET ID</th>
                <th>SUBJECT</th>
                <th>REQUESTED BY</th>
                <th>STATUS</th>
                <th>PRIORITY</th>
                <th>CATEGORY</th>
                <th>DATE CREATED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="tl-ref"
                    >
                      {ticket.reference_no}
                    </Link>
                  </td>

                  <td className="tl-subject">
                    {ticket.title}
                  </td>

                  <td>
                    <div className="tl-user">
                      <span
                        className="tl-avatar"
                        style={{
                          background: avatarColor(
                            ticket.requested_by
                          ),
                        }}
                      >
                        {initials(ticket.requested_by)}
                      </span>

                      {ticket.requested_by || "Unknown"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${ticket.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`priority-dot priority-${ticket.priority.toLowerCase()}`}
                    >
                      • {ticket.priority}
                    </span>
                  </td>

                  <td>{ticket.category}</td>

                  <td>
                    {new Date(
                      ticket.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="tl-actions">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(ticket.id)
                        }
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: 30,
                    }}
                  >
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="tl-pagination">
            <span>
              Showing{" "}
              {paginated.length === 0
                ? 0
                : (page - 1) * PAGE_SIZE + 1}{" "}
              to{" "}
              {Math.min(
                page * PAGE_SIZE,
                filtered.length
              )}{" "}
              of {filtered.length} tickets
            </span>

            <div>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ‹ Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="tl-footer">
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
    </div>
  );
}

export default TicketList;