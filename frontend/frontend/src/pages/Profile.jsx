import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: 40, maxWidth: 400 }}>
        <h2>My Profile</h2>
        <p style={{ color: "var(--text-muted)", marginTop: 10 }}>Name: {user?.name}</p>
        <p style={{ color: "var(--text-muted)" }}>Email: {user?.email}</p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "var(--danger)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius)",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;