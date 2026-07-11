import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TicketList.css";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost/InternShip/backend/get_tickets.php", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

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

    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h2>My Tickets</h2>
        <Link to="/create-ticket" className="new-ticket-btn">+ New Ticket</Link>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tickets.length === 0 && !error && <p>No tickets yet.</p>}

      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td><Link to={`/tickets/${ticket.id}`}>{ticket.reference_no}</Link></td>
              <td>{ticket.title}</td>
              <td>{ticket.category}</td>
              <td>{ticket.priority}</td>
              <td>
                <span className={`status-badge status-${ticket.status.toLowerCase().replace(" ", "-")}`}>
                  {ticket.status}
                </span>
              </td>
              <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketList;