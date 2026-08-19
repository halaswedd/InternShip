import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://affectionate-freedom-production-e166.up.railway.app/forgot_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-page-content">
        <div className="forgot-card">
          <h2>Reset Your Password</h2>

          <p className="forgot-subtitle">
            Enter your email address below and we'll send you a link to reset
            your password.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="forgot-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
          </form>

          {message && (
            <p className="forgot-success">{message}</p>
          )}

          {error && (
            <p className="forgot-error">{error}</p>
          )}

          <div className="forgot-divider"></div>

          <p className="back-link">
            Remembered your password?{" "}
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>

      <footer className="forgot-footer">
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

export default ForgotPassword;