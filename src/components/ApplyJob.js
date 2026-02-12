import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import "./ApplyJob.css";

function Apply() {

  const location = useLocation();
  const navigate = useNavigate();

  const job =
    location.state ||
    JSON.parse(localStorage.getItem("selectedJob") || "null");

  const user =
    JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    fullName: "",
    experience: "",
    skills: "",
    resume: null
  });

  const [loading, setLoading] = useState(false);

  if (!job || !job.title) {
    return <h2 style={{ textAlign: "center" }}>No Job Selected</h2>;
  }

  const submit = async (e) => {

    e.preventDefault();

    if (!user?.email) {
      alert("Please login first ❗");
      navigate("/login");
      return;
    }

    if (!form.resume) {
      alert("Please upload resume ❗");
      return;
    }

    setLoading(true);

    try {

      const data = new FormData();

      data.append("fullName", form.fullName);
      data.append("experience", form.experience);
      data.append("skills", form.skills);
      data.append("jobTitle", job.title);
      data.append("userEmail", user.email);
      data.append("resume", form.resume);

      const res = await API.post(
        "/api/applications",
        data,
      
      );

      alert(res.data || "Application submitted ✅ Please verify email");

      navigate("/profile");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data ||
        "Error submitting application ❗ Please try again."
      );
      

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container">
      <form className="apply" onSubmit={submit}>

        <h2>Apply for {job.title}</h2>

        <input
          required
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <input
          required
          placeholder="Experience"
          value={form.experience}
          onChange={(e) =>
            setForm({ ...form, experience: e.target.value })
          }
        />

        <textarea
          required
          placeholder="Skills"
          value={form.skills}
          onChange={(e) =>
            setForm({ ...form, skills: e.target.value })
          }
        />

        <input
          type="file"
          required
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setForm({ ...form, resume: e.target.files[0] })
          }
        />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default Apply;
