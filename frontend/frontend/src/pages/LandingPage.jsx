import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="lp-nav">
        <div className="lp-logo">IT<span>HelpDesk</span></div>
        <div className="lp-nav-links">
          <a href="#" className="active">Home</a>
          <a href="#about">About</a>
          <a href="#tickets">Tickets</a>
          <a href="#support">Support</a>
        </div>
        <div className="lp-nav-actions">
          <Link to="/login" className="lp-signin">Sign in →</Link>
          <Link to="/register" className="lp-getstarted">Get Started</Link>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-text">
          <h1>Solve IT Issues <span>Faster</span>, All in One Place</h1>
          <p>
            Submit support requests, track ticket status, and get help from your
            IT team quickly and easily. Experience systemic order in technical
            troubleshooting.
          </p>
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

      <section className="lp-features" id="about">
        <div className="lp-features-box">
          <h2>What Makes HelpDesk Special?</h2>
          <p className="lp-features-subtitle">
            Everything you need to manage technical incidents and service requests.
          </p>
          <div className="lp-features-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon">📋</div>
              <h3>Create Tickets</h3>
              <p>Report your technical problems easily with our intuitive forms and category tagging.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">⚡</div>
              <h3>Fast Support</h3>
              <p>Get solutions from IT specialists within minutes through our automated routing system.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">📈</div>
              <h3>Track Progress</h3>
              <p>Follow your ticket status anytime with real-time updates and notification alerts.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon">🔒</div>
              <h3>Secure System</h3>
              <p>Access data securely based on your organizational role with enterprise encryption.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-stats" id="tickets">
        <div className="lp-stat">
          <span className="lp-stat-number">99.8%</span>
          <span className="lp-stat-label">UPTIME RELIABILITY</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">15 min</span>
          <span className="lp-stat-label">AVG. RESPONSE TIME</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">1.2k+</span>
          <span className="lp-stat-label">TICKETS RESOLVED DAILY</span>
        </div>
      </section>

      <section className="lp-cta" id="support">
        <h2>Ready to streamline your IT operations?</h2>
        <p>Join thousands of teams who have transformed their technical support workflow into a seamless experience.</p>
        <Link to="/register" className="lp-btn white">Get Started Free</Link>
      </section>

      <footer className="lp-footer">
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
        <div className="lp-footer-social">
          <span>𝕏</span>
          <span>in</span>
          <span>◎</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;