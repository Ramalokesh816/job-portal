import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Admin.css";

function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    companies: 0,
    jobs: 0,
    applications: 0
  });

  const [loading, setLoading] = useState(true);

  /* ================= CHECK ADMIN ================= */

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  /* ================= LOAD STATS ================= */

  useEffect(() => {

    const loadStats = async () => {

      try {

        const results = await Promise.allSettled([
          API.get("/api/employers"),
          API.get("/api/jobs"),
          API.get("/api/applications")
        ]);

        setStats({
          companies: results[0].status === "fulfilled"
            ? results[0].value.data.length
            : 0,

          jobs: results[1].status === "fulfilled"
            ? results[1].value.data.length
            : 0,

          applications: results[2].status === "fulfilled"
            ? results[2].value.data.length
            : 0
        });

      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

  }, []);

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "80px" }}>
        Loading Dashboard...
      </p>
    );
  }

  return (
    <div className="admin-page">

      <h2>Admin Dashboard</h2>

      <div className="dashboard-grid">

        <div className="box">
          <h3>{stats.companies}</h3>
          <p>Companies</p>
        </div>

        <div className="box">
          <h3>{stats.jobs}</h3>
          <p>Jobs</p>
        </div>

        <div className="box">
          <h3>{stats.applications}</h3>
          <p>Applications</p>
        </div>

      </div>

      {/* ACTION BUTTONS */}

      <div style={{ marginTop: "25px" }}>

        <button
          onClick={() => navigate("/manage-companies")}
          style={{ marginRight: "15px" }}
        >
          Manage Companies
        </button>

        <button
          onClick={() => navigate("/manage-jobs")}
        >
          Manage Jobs
        </button>

      </div>

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          background: "#dc3545"
        }}
      >
        Logout
      </button>

    </div>
  );
}

export default AdminDashboard;
