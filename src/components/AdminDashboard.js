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


  /* ================= LOAD STATS SAFELY ================= */

  useEffect(() => {

    const loadStats = async () => {

      try {

        const results = await Promise.allSettled([

          API.get("/api/employers"),
          API.get("/api/jobs"),
          API.get("/api/applications")

        ]);

        const companies =
          results[0].status === "fulfilled"
            ? results[0].value.data.length
            : 0;

        const jobs =
          results[1].status === "fulfilled"
            ? results[1].value.data.length
            : 0;

        const applications =
          results[2].status === "fulfilled"
            ? results[2].value.data.length
            : 0;

        setStats({
          companies,
          jobs,
          applications
        });

      } catch (err) {

        console.error("Dashboard Error:", err);

      } finally {

        setLoading(false);

      }
    };

    loadStats();

  }, []);


  /* ================= LOADING ================= */

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


      {/* DASHBOARD BOXES */}
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


      {/* MANAGE BUTTON */}
      <button
        style={{ marginTop: "15px" }}
        onClick={() => navigate("/manage-companies")}
      >
        Manage Companies
      </button>

    </div>
  );
}

export default AdminDashboard;
