import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./TicketDetails.css";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [statusId, setStatusId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(
          `http://localhost/InternShip/backend/get_ticket.php?id=${id}`,
          {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (data.success) {
          const t = data.ticket;
          setTicket(t);
          setTitle(t.title);
          setDescription(t.description);
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

    fetchTicket();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
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
          title,
          description,
          category_id: categoryId,
          priority_id: priorityId,
          status_id: statusId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Ticket updated successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while updating.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost/InternShip/backend/delete_ticket.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ticket_id: id }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/tickets");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong while deleting.");
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <p style={{ padding: 40 }}>Loading ticket...</p>
    </>
  );

  if (error && !ticket) return (
    <>
      <Navbar />
      <p style={{ padding: 40, color: "red" }}>{error}</p>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="ticket-details-container">
        <Link to="/tickets" className="back-link">&larr; Back to tickets</Link>
        <h2>{ticket.reference_no}</h2>

        <form onSubmit={handleUpdate}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />

          <label>Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="1">Hardware</option>
            <option value="2">Software</option>
            <option value="3">Network</option>
            <option value="4">Email</option>
            <option value="5">Access Request</option>
            <option value="6">Other</option>
          </select>

          <label>Priority</label>
          <select value={priorityId} onChange={(e) => setPriorityId(e.target.value)}>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Critical</option>
          </select>

          <label>Status</label>
          <select value={statusId} onChange={(e) => setStatusId(e.target.value)}>
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="3">Pending</option>
            <option value="4">Resolved</option>
            <option value="5">Closed</option>
          </select>

          <div className="button-row">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="delete-btn" onClick={handleDelete}>Delete Ticket</button>
          </div>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    </>
  );
}

export default TicketDetails;