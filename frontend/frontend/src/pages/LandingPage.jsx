import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="lp-nav">
        <div className="lp-logo">IT<span>HelpDesk</span></div>
        <div className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#stats">About</a>
        </div>
        <Link to="/login" className="lp-nav-btn">Sign In</Link>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-text">
          <h1>Solve IT issues <span>faster</span>, all in one place</h1>
          <p>Submit support tickets, track their status, and get help from your IT team — quickly and transparently.</p>
          <div className="lp-hero-buttons">
            <Link to="/register" className="lp-btn primary">Get Started</Link>
            <Link to="/login" className="lp-btn secondary">Login</Link>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-visual-card">
            <div className="lp-visual-row">
              <span className="lp-dot open"></span>
              <span>Printer not working</span>
              <span className="lp-tag high">High</span>
            </div>
            <div className="lp-visual-row">
              <span className="lp-dot progress"></span>
              <span>VPN access request</span>
              <span className="lp-tag medium">Medium</span>
            </div>
            <div className="lp-visual-row">
              <span className="lp-dot resolved"></span>
              <span>Email sync issue</span>
              <span className="lp-tag low">Low</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-features" id="features">
        <div className="lp-features-box">
          <h2>What makes HelpDesk work</h2>
          <div className="lp-features-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon">✓</div>
              <h3>Create Tickets</h3>
              <p>Submit a request in seconds — pick a category and priority, and you're done.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">⚡</div>
              <h3>Fast Response</h3>
              <p>Tickets route straight to the right support agent, so nothing sits unseen.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Follow every ticket from Open to Resolved, with a full history of updates.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Role-based permissions keep every ticket visible only to the right people.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-stats" id="stats">
        <div className="lp-stat">
          <span className="lp-stat-number">99.8%</span>
          <span className="lp-stat-label">Uptime</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">15 min</span>
          <span className="lp-stat-label">Avg. first response</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">1.2k+</span>
          <span className="lp-stat-label">Tickets resolved</span>
        </div>
      </section>

      <section className="lp-cta">
        <h2>Ready to streamline your IT operations?</h2>
        <p>Create an account and submit your first ticket in under a minute.</p>
        <Link to="/register" className="lp-btn white">Get Started</Link>
      </section>

      <footer className="lp-footer">
        <span>IT HelpDesk</span>
        <span>Internal support system</span>
      </footer>
    </div>
  );
}

export default LandingPage;