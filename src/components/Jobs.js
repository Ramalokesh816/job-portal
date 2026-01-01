import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Jobs.css";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page">
      <h2>Available Jobs</h2>

      {jobs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No jobs available</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <button onClick={() => navigate("/apply", { state: job })}>
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
