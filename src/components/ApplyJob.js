import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../services/api";

import "./ApplyJob.css";

function Apply() {

  const { state: job } = useLocation();
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user"));


  const [formData, setFormData] =
    useState({
      fullName: "",
      experience: "",
      skills: "",
      resume: null
    });

  const [loading, setLoading] =
    useState(false);


  if (!job || !job.title) {

    return <h2>No Job Selected</h2>;
  }


  const submit = async (e) => {

    e.preventDefault();

    if (!user?.email) {

      alert("Login first");
      navigate("/login");
      return;
    }

    if (!formData.resume) {

      alert("Upload resume");
      return;
    }

    setLoading(true);

    try {

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("experience", formData.experience);
      data.append("skills", formData.skills);
      data.append("jobTitle", job.title);
      data.append("userEmail", user.email);
      data.append("resume", formData.resume);


      const res = await API.post(
        "/api/applications",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      if (res.status === 200) {

        alert("Applied ✅");

        navigate("/profile");

      }

    } catch (err) {

      console.log(err);

      alert("Failed ❌");

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="apply-container">

      <form
        className="apply"
        onSubmit={submit}
      >

        <h2>Apply for {job.title}</h2>


        <input
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


        <input
          placeholder="Experience"
          required
          value={formData.experience}
          onChange={(e) =>
            setFormData({
              ...formData,
              experience: e.target.value
            })
          }
        />


        <textarea
          placeholder="Skills"
          required
          value={formData.skills}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value
            })
          }
        />


        <input
          type="file"
          required
          onChange={(e) =>
            setFormData({
              ...formData,
              resume: e.target.files[0]
            })
          }
        />


        <button disabled={loading}>
          {loading
            ? "Submitting..."
            : "Submit"}
        </button>

      </form>

    </div>
  );
}

export default Apply;
