import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../services/api";

import "./ApplyJob.css";

function Apply() {

  const { state: job } = useLocation();
  const navigate = useNavigate();


  // Logged in user
  const user =
    JSON.parse(localStorage.getItem("user"));


  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    experience: "",
    skills: "",
    resume: null
  });

  const [loading, setLoading] = useState(false);


  // No job selected
  if (!job || !job.title) {

    return (
      <h2 style={{ textAlign: "center" }}>
        No Job Selected
      </h2>
    );
  }


  /* ================= SUBMIT FORM ================= */

  const submit = async (e) => {

    e.preventDefault();


    // Check login
    if (!user || !user.email) {

      alert("Please login first ❗");

      navigate("/login");

      return;
    }


    // Check resume
    if (!formData.resume) {

      alert("Please upload your resume ❗");

      return;
    }


    setLoading(true);


    try {

      // Prepare multipart data
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("experience", formData.experience);
      data.append("skills", formData.skills);
      data.append("jobTitle", job.title);
      data.append("userEmail", user.email);
      data.append("resume", formData.resume);


      // Send to backend (CORRECT URL)
      await API.post(
        "/api/applications",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );


      alert("Job Applied Successfully ✅");

      // Redirect to profile
      navigate("/profile");


    } catch (err) {

      console.log("Apply Error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to apply ❌"
      );


    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="apply-container">

      <form
        className="apply animate"
        onSubmit={submit}
      >

        <h2>Apply for {job.title}</h2>


        {/* JOB REQUIREMENTS */}
        <div className="requirements">

          <h4>Job Requirements</h4>

          <ul>
            <li>✔ Good communication skills</li>
            <li>✔ Basic technical knowledge</li>
            <li>✔ Team work ability</li>
            <li>✔ Willingness to learn</li>
          </ul>

        </div>


        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Full Name"
          required
          value={formData.fullName}
          onChange={(e) =>
            setFormData({
              ...formData,
              fullName: e.target.value
            })
          }
        />


        {/* EXPERIENCE */}
        <input
          type="text"
          placeholder="Experience (Eg: 2 Years)"
          required
          value={formData.experience}
          onChange={(e) =>
            setFormData({
              ...formData,
              experience: e.target.value
            })
          }
        />


        {/* SKILLS */}
        <textarea
          placeholder="Skills (React, Java, SQL...)"
          required
          value={formData.skills}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value
            })
          }
        />


        {/* RESUME */}
        <div className="resume-upload">

          <label>Upload Resume (PDF/DOC)</label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                resume: e.target.files[0]
              })
            }
          />

        </div>


        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Application"}
        </button>

      </form>

    </div>
  );
}

export default Apply;
