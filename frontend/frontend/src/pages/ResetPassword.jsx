import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid link. Token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/InternShip/backend/reset_password.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-content">
        <div className="reset-card">
          <h2>Reset Your Password</h2>

          <p className="subtitle">
            Enter your new password below to reset your account password.
          </p>

          {message && <div className="success-msg">{message}</div>}
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password →"}
            </button>
          </form>
        </div>
      </div>

      <footer className="reset-footer">
        <div className="footer-left">
          <h3>ITHelpDesk</h3>
          <p>© 2026 HelpDesk. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;