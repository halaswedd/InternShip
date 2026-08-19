import { useState } from "react";
import { Link } from "react-router-dom";
import { User, UserCog, Menu, X } from "lucide-react";
import NotificationBell from "./NotificationsBell";
import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role_id === 1;
  const isEmployee = user?.role_id === 3;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="app-navbar">
      <Link to="/dashboard" className="app-logo">
        IT<span>HelpDesk</span>
      </Link>

      <div className={`app-nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/tickets" onClick={() => setMenuOpen(false)}>
          Tickets
        </Link>

        {!isEmployee && (
          <Link to="/reports" onClick={() => setMenuOpen(false)}>
            Reports
          </Link>
        )}

        <Link to="/ai-assistant" onClick={() => setMenuOpen(false)}>
          AI Assistant
        </Link>
      </div>

      <div className="app-nav-icons">
        <NotificationBell />

        {isAdmin && (
          <Link to="/admin" className="icon-btn" title="Admin Panel">
            <UserCog size={18} />
          </Link>
        )}

        <Link to="/profile" className="icon-btn" title="Profile">
          <User size={18} />
        </Link>

        <button
          className="app-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;