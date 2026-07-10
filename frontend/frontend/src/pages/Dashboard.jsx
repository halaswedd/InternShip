import "./Dashboard.css";
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}!</h2>
      <p>This is a placeholder dashboard. More features coming soon.</p>
    </div>
  );
}

export default Dashboard;