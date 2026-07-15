import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/InternShip/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
  console.error(err);
  setError(err.message || "Something went wrong. Please try again.");
}
  };

  return (
    <div className="register-page">
      <div className="register-page-content">
        <div className="register-card">
          <h2>Get Started Now</h2>

          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-row">
              <div className="password-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="password-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <label className="agree-terms">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>.
              </span>
            </label>

            <button type="submit" className="register-btn">Register</button>
          </form>

          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          <p className="signin-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <footer className="register-footer">
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
    </div>
  );
}

export default Register;