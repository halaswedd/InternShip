import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, ShieldCheck, User, Lock, X } from "lucide-react";
import Navbar from "../components/Navbar";
import "./Profile.css";

const ROLE_NAMES = {
  1: "Admin",
  2: "IT Support Agent",
  3: "Employee",
  4: "Manager",
};

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setPwError("");
    setPwSuccess("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    try {
      const response = await fetch("http://localhost/InternShip/backend/change_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setPwSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setPwError(data.message);
      }
    } catch (err) {
      setPwError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pf-page">
        <div className="pf-card">
          <div className="pf-header">
            <div className="pf-avatar">{initials(user?.name)}</div>
            <div>
              <h2>{user?.name}</h2>
              <span className={`pf-role-badge role-${(ROLE_NAMES[user?.role_id] || "").toLowerCase().replace(" ", "-")}`}>
                {ROLE_NAMES[user?.role_id] || "User"}
              </span>
            </div>
          </div>

          <div className="pf-divider"></div>

          <div className="pf-info-row">
            <Mail size={16} />
            <div>
              <p className="pf-info-label">Email</p>
              <p className="pf-info-value">{user?.email}</p>
            </div>
          </div>

          <div className="pf-info-row">
            <ShieldCheck size={16} />
            <div>
              <p className="pf-info-label">Role</p>
              <p className="pf-info-value">{ROLE_NAMES[user?.role_id] || "User"}</p>
            </div>
          </div>

          <div className="pf-info-row">
            <User size={16} />
            <div>
              <p className="pf-info-label">User ID</p>
              <p className="pf-info-value">#{user?.id}</p>
            </div>
          </div>

          <div className="pf-divider"></div>

          <button className="pf-change-pw-btn" onClick={() => setShowModal(true)}>
            <Lock size={16} /> Change Password
          </button>

          <button className="pf-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {showModal && (
        <div className="pf-modal-overlay" onClick={closeModal}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3><Lock size={16} /> Change Password</h3>
              <button className="pf-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="pf-password-form">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              {pwError && <p className="pf-pw-error">{pwError}</p>}
              {pwSuccess && <p className="pf-pw-success">{pwSuccess}</p>}

              <button type="submit" className="pf-save-btn">Update Password</button>
            </form>
          </div>
        </div>
      )}

      <footer className="pf-footer">
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

export default Profile;