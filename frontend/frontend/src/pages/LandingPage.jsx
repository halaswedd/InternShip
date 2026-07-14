import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>IT Help Desk</h1>
        <p>Submit, track, and resolve IT support tickets — all in one place.</p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn primary">Login</Link>
          <Link to="/register" className="landing-btn secondary">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;