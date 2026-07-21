import { Link } from "react-router-dom";
import { Bell, User, Settings } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role_id === 1;

  return (
    <nav className="app-navbar">
      <Link to="/dashboard" className="app-logo">
        IT<span>HelpDesk</span>
      </Link>

      <div className="app-nav-links">
        <Link to="/dashboard">Home</Link>
        <Link to="/tickets">Tickets</Link>
        <Link to="/dashboard">Reports</Link>
      </div>

      <div className="app-nav-icons">
        <Link to="/notifications" className="icon-btn" title="Notifications">
          <Bell size={18} />
        </Link>
        {isAdmin && (
          <Link to="/admin" className="icon-btn" title="Admin Panel">
            <Settings size={18} />
          </Link>
        )}
        <Link to="/profile" className="icon-btn" title="Profile">
          <User size={18} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;