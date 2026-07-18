import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CreateTicket.css";

const priorities = [
  { id: "1", label: "Low" },
  { id: "2", label: "Medium" },
  { id: "3", label: "High" },
  { id: "4", label: "Urgent" },
];

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("1");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

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
    <>
      <Navbar />
      <div className="ct-page">
        <div className="ct-card">
          <h2>Create New Ticket</h2>
          <p className="ct-subtitle">Describe your issue in detail and we'll get a technician on it immediately.</p>

          <form onSubmit={handleSubmit}>
            <label>Ticket Subject</label>
            <input
              type="text"
              placeholder="Brief summary of the issue (e.g., Cannot connect)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="ct-row">
              <div className="ct-field">
                <label>Problem Category</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Select category</option>
                  <option value="1">Hardware</option>
                  <option value="2">Software</option>
                  <option value="3">Network</option>
                  <option value="4">Email</option>
                  <option value="5">Access Request</option>
                  <option value="6">Other</option>
                </select>
              </div>

              <div className="ct-field">
                <label>Priority Level</label>
                <div className="ct-priority-pills">
                  {priorities.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`ct-pill ${priorityId === p.id ? "active" : ""}`}
                      onClick={() => setPriorityId(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label>Detailed Description</label>
            <textarea
              placeholder="Include as much detail as possible:"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
            />

            <label>Attachments</label>
            <div className="ct-dropzone">
              <span className="ct-dropzone-icon">☁️</span>
              <p>Drag & drop files or <span className="ct-browse">browse</span></p>
              <span className="ct-dropzone-hint">Max file size: 10MB (PDF, PNG, JPG)</span>
            </div>

            <div className="ct-divider"></div>

            <div className="ct-actions">
              <button type="button" className="ct-cancel" onClick={() => navigate("/tickets")}>Cancel</button>
              <button type="submit" className="ct-submit">Submit Ticket →</button>
            </div>
          </form>

          {error && <p className="ct-error">{error}</p>}
          {success && <p className="ct-success">{success}</p>}
        </div>
      </div>

      <footer className="ct-footer">
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

export default CreateTicket;