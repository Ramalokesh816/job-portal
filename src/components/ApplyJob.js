import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../services/api";

import "./ApplyJob.css";

function Apply() {

  const { state: job } = useLocation();
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user"));


  const [form, setForm] = useState({
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

    if (!form.resume) {

      alert("Upload resume");
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
        data
      );

      if (res.data) {

        alert("Applied ✅");

        navigate("/profile");
      }

    } catch {

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
          required
          placeholder="Full Name"
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value
            })
          }
        />


        <input
          required
          placeholder="Experience"
          onChange={(e) =>
            setForm({
              ...form,
              experience: e.target.value
            })
          }
        />


        <textarea
          required
          placeholder="Skills"
          onChange={(e) =>
            setForm({
              ...form,
              skills: e.target.value
            })
          }
        />


        <input
          type="file"
          required
          onChange={(e) =>
            setForm({
              ...form,
              resume: e.target.files[0]
            })
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
