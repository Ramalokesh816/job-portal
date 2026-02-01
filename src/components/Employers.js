import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Employers.css";

function Employers() {

  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]); // ✅ Store jobs
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH EMPLOYERS + JOBS ================= */

  useEffect(() => {

    setLoading(true);

    Promise.all([
      API.get("/api/employers"),
      API.get("/api/jobs")
    ])

      .then(([empRes, jobRes]) => {

        setEmployers(empRes.data);
        setJobs(jobRes.data);

      })

      .catch(err => {
        console.error("Fetch Error:", err);
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);


  /* ================= COUNT JOBS ================= */

  const getJobCount = (companyName) => {
    return jobs.filter(
      job => job.company === companyName
    ).length;
  };


  return (
    <div className="page">

      <h2>Top Hiring Companies</h2>

      <p className="sub-text">
        Discover companies actively hiring on JobConnect
      </p>


      {/* LOADING */}
      {loading && <p>Loading companies...</p>}


      {/* EMPLOYERS GRID */}
      {!loading && (

        <div className="employer-grid">

          {employers.length === 0 ? (

            <p>No employers found</p>

          ) : (

            employers.map(emp => {

              const jobCount = getJobCount(emp.name);

              return (

                <div key={emp.id} className="employer-card">


                  {/* LOGO */}
                  <img
                    src={
                      emp.logo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={emp.name}
                  />


                  {/* NAME */}
                  <h3>{emp.name}</h3>


                  {/* LOCATION */}
                  <p className="location">
                    📍 {emp.location || "India"}
                  </p>


                  {/* HIRING FIELD */}
                  <p>
                    Hiring for:{" "}
                    <b>{emp.hiringFor}</b>
                  </p>


                  {/* JOB COUNT */}
                  {jobCount > 0 ? (
                    <p className="count hiring">
                      ✅ Hiring ({jobCount} Jobs)
                    </p>
                  ) : (
                    <p className="count not-hiring">
                      ❌ Not Hiring
                    </p>
                  )}


                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      navigate("/jobs", {
                        state: { company: emp.name }
                      })
                    }
                  >
                    View Jobs
                  </button>

                </div>

              );
            })

          )}

        </div>

      )}

    </div>
  );
}

export default Employers;
