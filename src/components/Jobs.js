import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import "./Jobs.css";

function Jobs() {

  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get company name from Employers page (if exists)
  const company = location.state?.company || null;


  /* ================= FETCH JOBS ================= */

  useEffect(() => {

    setLoading(true);

    API.get("/api/jobs")

      .then((res) => {

        let data = res.data;

        // Filter by company if coming from Employers
        if (company) {
          data = data.filter(
            job => job.company === company
          );
        }

        setJobs(data);

      })

      .catch((err) => {
        console.error(err);
        setJobs([]);
      })

      .finally(() => {
        setLoading(false);
      });

  }, [company]);


  return (
    <div className="page">


      {/* PAGE TITLE */}
      <h2>
        {company
          ? `${company} Jobs`
          : "Available Jobs"}
      </h2>


      {/* BACK TO ALL JOBS */}
      {company && (
        <button
          className="back-btn"
          onClick={() => navigate("/jobs")}
        >
          ← All Jobs
        </button>
      )}


      {/* LOADING */}
      {loading && (
        <p style={{ textAlign: "center" }}>
          Loading jobs...
        </p>
      )}


      {/* NO JOBS */}
      {!loading && jobs.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No jobs available
        </p>
      )}


      {/* JOB LIST */}
      {!loading && jobs.length > 0 && (

        <div className="job-list">

          {jobs.map((job) => (

            <div key={job.id} className="job-card">

              <h3>{job.title}</h3>

              <p className="company">
                🏢 {job.company}
              </p>

              <p className="location">
                📍 {job.location || "India"}
              </p>

              <button
                onClick={() =>
                  navigate("/apply", { state: job })
                }
              >
                Apply
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Jobs;
