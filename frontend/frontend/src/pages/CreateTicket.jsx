import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [priorityId, setPriorityId] = useState("2");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost/InternShip/backend/create_ticket.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category_id: categoryId,
          priority_id: priorityId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Ticket created! Reference: ${data.reference_no}`);
        setTimeout(() => navigate("/tickets"), 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="create-ticket-container">
      <h2>Create New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
        <br /><br />

        <label>Category:</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="1">Hardware</option>
          <option value="2">Software</option>
          <option value="3">Network</option>
          <option value="4">Email</option>
          <option value="5">Access Request</option>
          <option value="6">Other</option>
        </select>
        <br /><br />

        <label>Priority:</label>
        <select value={priorityId} onChange={(e) => setPriorityId(e.target.value)}>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
          <option value="4">Critical</option>
        </select>
        <br /><br />

        <button type="submit">Create Ticket</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default CreateTicket;