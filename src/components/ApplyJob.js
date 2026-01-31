import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import "./ApplyJob.css";

function Apply() {

  const { state: job } = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    fullName: "",
    experience: "",
    skills: ""
  });

  if (!job) {
    return <h2>No Job Selected</h2>;
  }

  const submit = async (e) => {
    e.preventDefault();

    // Check login
    if (!user || !user.email) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {

      await API.post("/api/applications", {
        ...formData,
        jobTitle: job.title,
        userEmail: user.email,
        appliedAt: new Date()
      });

      alert("Job Applied Successfully ✅");

      // Go to My Applications
      navigate("/my-applications");

    } catch (err) {
      console.log(err);
      alert("Failed to apply ❌");
    }
  };

  return (
    <form className="apply" onSubmit={submit}>

      <h2>Apply for {job.title}</h2>

      <input
        placeholder="Full Name"
        required
        onChange={e =>
          setFormData({ ...formData, fullName: e.target.value })
        }
      />

      <input
        placeholder="Experience"
        required
        onChange={e =>
          setFormData({ ...formData, experience: e.target.value })
        }
      />

      <textarea
        placeholder="Skills"
        required
        onChange={e =>
          setFormData({ ...formData, skills: e.target.value })
        }
      />

      <button type="submit">Apply</button>

    </form>
  );
}

export default Apply;
