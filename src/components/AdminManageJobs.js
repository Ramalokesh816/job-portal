import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminManageJobs.css";


function AdminManageJobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  /* LOAD JOBS */
  useEffect(() => {

    loadJobs();

  }, []);


  const loadJobs = async () => {

    try {

      const res = await axios.get(
        "https://job-portal-4-ohxr.onrender.com/api/admin/jobs"
      );

      setJobs(res.data);

    } catch {

      alert("Failed to load jobs ❌");

    } finally {

      setLoading(false);
    }
  };


  /* DELETE JOB */

  const deleteJob = async (id) => {

    if (!window.confirm("Delete this job?")) return;

    try {

      await axios.delete(
        `https://job-portal-4-ohxr.onrender.com/api/admin/jobs/${id}`
      );

      setJobs(prev =>
        prev.filter(job => job.id !== id)
      );

      alert("Job deleted ✅");

    } catch {

      alert("Delete failed ❌");
    }
  };


  return (
  <div className="admin-jobs-page">

    <h2>Manage Jobs</h2>


    {loading ? (

      <p className="loading-text">Loading...</p>

    ) : jobs.length === 0 ? (

      <p className="empty-text">No jobs found</p>

    ) : (

      <div className="table-wrapper">

        <table className="admin-jobs-table">

          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>


          <tbody>

            {jobs.map(job => (

              <tr key={job.id}>

                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>

                <td>
                  <button
                    className="delete-job-btn"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    )}

  </div>
);

}

export default AdminManageJobs;
